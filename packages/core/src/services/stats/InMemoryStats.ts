
import { ArrayUtils } from '@core'
import { addDays, isSameDay } from 'date-fns'
import type { GameId } from '../game'
import type { PlayerId } from '../player'
import { CoopPlaythroughData, PlaythroughData, ScoreData, VsPlaythroughData } from '../playthrough'
import type { StatPerGame, StatsService } from './StatsService'
import type { CoopWinratesData, PlayerWinrateData, PlaysByDateData, PlayStreakData, ScoreStatData, ScoreStatsData, WinrateData } from './WinrateData'



/**
 * Simple implementation using the playthrough service all in memory
 */
export class InMemoryStats implements PlaythroughArgs<StatsService> {


  //
  // StatsService implementations
  // ============================


  public async getNumPlays(playthroughs: ReadonlyArray<PlaythroughData>): Promise<StatPerGame<number>> {
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs.length)
  }

  public async getWinrates(playthroughs: ReadonlyArray<PlaythroughData>): Promise<StatPerGame<PlayerWinrateData[] | CoopWinratesData>> {
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, group =>
      CoopPlaythroughData.guardCollection(group)
        ? this.calculateCoopWinrates(group)
        : this.calculateWinrates(group)
    )
  }

  public async getOverallWinrates(playthroughs: ReadonlyArray<PlaythroughData>): Promise<PlayerWinrateData[]> {
    return this.calculateWinrates(playthroughs)
  }

  public async getLastPlayed(playthroughs: ReadonlyArray<PlaythroughData>): Promise<StatPerGame<Date | undefined>> {
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs[0]?.playedOn)
  }

  public async getNumPlaysByMonth(playthroughs: ReadonlyArray<PlaythroughData>): Promise<number[]> {
    const groupedByMonth: number[] = []
    for (const playthrough of playthroughs) {
      const monthPlayed = playthrough.playedOn.getMonth()
      groupedByMonth[monthPlayed] = (groupedByMonth[monthPlayed] ?? 0) + 1
    }
    return groupedByMonth
  }

  public async getNumUniqueGamesPlayed(playthroughs: ReadonlyArray<PlaythroughData>): Promise<number> {
    const uniqueGames = new Set<GameId>()
    playthroughs.forEach(playthrough => uniqueGames.add(playthrough.gameId))
    return uniqueGames.size
  }
  
  public async getScoreStats(playthroughs: ReadonlyArray<PlaythroughData>): Promise<StatPerGame<ScoreStatsData | undefined>> {
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, this.calculateScoreStats)
  }

  public async getNumPlaysByDate(playthroughs: ReadonlyArray<PlaythroughData>): Promise<PlaysByDateData[]> {
    // by default playthroughs are ordered by played_on date desc
    playthroughs = playthroughs.toReversed()
    
    const result: PlaysByDateData[] = []
    // return empty array if there are no playthroughs
    if (playthroughs.length === 0) {
      return result
    }

    let preDate = playthroughs[0]?.playedOn
    let plays = 0
    // looping for n+1 times on purpose
    // this way we "flush" the last one onto result
    for (let i = 0; i <= playthroughs.length; i++) {
      if (isSameDay(preDate, playthroughs[i]?.playedOn)) {
        plays++
      } else {
        result.push({ date: preDate, plays })
        preDate = playthroughs[i]?.playedOn
        plays = 1
      }
    }
    return result
  }

  public async getPlayStreak(playthroughs: ReadonlyArray<PlaythroughData>): Promise<PlayStreakData> {
    // by default playthroughs are ordered by played_on date desc
    playthroughs = playthroughs.toReversed()

    let bestStreak = 0
    let currentStreak = 0
    let bestStart = playthroughs[0]?.playedOn
    let currentStart = bestStart
    let lastPlayed = new Date(0) // some arbitrary defined date
    for (const playthrough of playthroughs) {
      // if we played the same day then we skip
      if (isSameDay(lastPlayed, playthrough.playedOn)) {
        continue
      }
      // if we played the next day then we increment the streak
      else if (isSameDay(playthrough.playedOn, addDays(lastPlayed, 1))) {
        currentStreak++
      }
      // if there was a break in the streak then we start over
      else {
        currentStreak = 1
        currentStart = playthrough.playedOn
      }

      if (currentStreak > bestStreak) {
        bestStreak = currentStreak
        bestStart = currentStart
      }
      lastPlayed = playthrough.playedOn
    }

    return { bestStreak, bestStart, currentStreak }
  }


  //
  // protected and private
  // =====================


  private groupedByGame(playthroughs: ReadonlyArray<PlaythroughData>): Record<GameId, PlaythroughData[]> {
    const grouped: Record<GameId, PlaythroughData[]> = {}

    for (const playthrough of playthroughs) {
      const group = grouped[playthrough.gameId]
      
      if (group) {
        group.push(playthrough)
      }
      else {
        grouped[playthrough.gameId] = [playthrough]
      }
    }

    return grouped
  }

  private forEachGroup<TOut>(
    grouped: Record<GameId, PlaythroughData[]>,
    reduce: (group: PlaythroughData[]) => TOut
  ): StatPerGame<TOut> {

    const result: StatPerGame<TOut> = {}
    for (const id in grouped) {
      const gameId = id as GameId
      const group = grouped[gameId]
      result[gameId] = reduce(group)
    }

    return result
  }

  private calculateWinrates(playthroughs: ReadonlyArray<PlaythroughData>): PlayerWinrateData[] {
    // 1. store for each player how many plays and wins they got
    const allStats = new Map<PlayerId, {plays: number, wins: number}>()
    for (const playthrough of playthroughs) {
      
      // a. set/update play for each player in this playthrough
      // tied games are ignored (coop games don't support tying)
      if ((VsPlaythroughData.guard(playthrough) && playthrough.winnerId !== null) || CoopPlaythroughData.guard(playthrough)) {
        playthrough.playerIds.forEach(playerId => {
          const playerStats = allStats.get(playerId)
          if (playerStats) {
            playerStats.plays++
          } else {
            allStats.set(playerId, {wins: 0, plays: 1})
          }
        })
      }

      // b. update wins count based on playthrough result
      // make sure to check winnerId (it can be null which means a tie)
      if (VsPlaythroughData.guard(playthrough) && playthrough.winnerId !== null) {
        const playerId = playthrough.winnerId
        const stats = allStats.get(playerId)!
        stats.wins++
      }
      // make sure to check if result equal to true (it can be null which means a tie)
      else if (CoopPlaythroughData.guard(playthrough)) {
        if (playthrough.playersWon) {
          playthrough.playerIds.forEach(playerId => {
            allStats.get(playerId)!.wins++
          })
        }
      }
    }

    // 2. once all plays and wins are counted then we calculate winrates for each player
    const winrates: PlayerWinrateData[] = []
    for (const [playerId, stats] of allStats) {
      winrates.push({ playerId, plays: stats.plays, winrate: stats.wins / stats.plays })
    }

    return winrates
  }

  private calculateCoopWinrates(playthroughs: ReadonlyArray<CoopPlaythroughData>): CoopWinratesData {
    // 1. store stats for each player and the game itself
    const allStats = new Map<PlayerId, { plays: number, wins: number }>()
    let gamePlays = 0
    let gameWins = 0

    // go through each playthrough, tracking plays and wins
    for (const playthrough of playthroughs) {

      // a. track game
      gamePlays++
      if (!playthrough.playersWon) {
        gameWins++
      }

      // b. track players
      playthrough.playerIds.forEach(playerId => {
        const stats = allStats.get(playerId)
        if (stats) {
          stats.plays++
          if (playthrough.playersWon) {
            stats.wins++
          }
        } else {
          allStats.set(playerId, { plays: 1, wins: playthrough.playersWon ? 1 : 0 })
        }
      })
    }

    // 2. calculate winrates for players and game
    const game: WinrateData = { plays: gamePlays, winrate: gameWins / gamePlays }
    // players (overall) winrate is derived from the game winrate
    const players: WinrateData = { plays: game.plays, winrate: 1 - game.winrate }
    const winrates: PlayerWinrateData[] = []
    for (const [playerId, stats] of allStats) {
      winrates.push({ playerId, plays: stats.plays, winrate: stats.wins / stats.plays })
    }

    return {
      game,
      players,
      winrates
    }
  }

  // assume all playthroughs are of the same game
  private calculateScoreStats(playthroughs: ReadonlyArray<PlaythroughData>): ScoreStatsData | undefined {
    if (playthroughs.length === 0) {
      return undefined
    }

    const gameType = playthroughs[0].type
    let allScores: ScoreStatData[]

    if (gameType === 'vs') {
      allScores = (playthroughs as ReadonlyArray<VsPlaythroughData>)
        .flatMap(p => p.scores?.map(score => ({ ...score, playthroughId: p.id })) ?? [])
    } else if (gameType === 'coop') {
      allScores = (playthroughs as ReadonlyArray<CoopPlaythroughData>)
        .flatMap(p => p.score !== undefined ? [{ score: p.score, playthroughId: p.id }] : [])
    } else {
      throw new Error('calculateScoreStats does not support this game type')
    }

    if (allScores.length === 0) {
      return undefined
    }

    return {
      highScore: ArrayUtils.best(allScores, (a, b) => a.score > b.score ? a : b),
      lowScore: ArrayUtils.best(allScores, (a, b) => a.score < b.score ? a : b),
      averageScore: ArrayUtils.average(allScores.map(s => s.score))
    }
  }

}


type PlaythroughArgs<T> = {
  [TKey in keyof T]: T[TKey] extends (...args: any[]) => infer TReturn
    ? (playthroughs: ReadonlyArray<PlaythroughData>) => TReturn
    : T[TKey]
}