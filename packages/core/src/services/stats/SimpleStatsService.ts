import type { PlayerId } from '../player'
import { GameType, type GameId } from '../game'
import type { PlaythroughDto, PlaythroughQueryOptions, PlaythroughService, ScoreDto } from '../playthrough'
import type { ScoreStatDto, ScoreStatsDto, StatsQuery, StatsResultData, StatsService, WinrateDto } from './StatsService'
import { endOfYear } from 'date-fns'
import { ArrayUtils } from '@core'


/**
 * Simple implementation using the playthrough service
 */
export class SimpleStatsService implements StatsService {

  public constructor(
    private _playthroughService: PlaythroughService
  ) { }


  //
  // StatsService implementations
  // ============================


  public async getNumPlays(query: StatsQuery = {}): Promise<StatsResultData<number>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs.length)
  }

  public async getWinrates(query: StatsQuery = {}): Promise<StatsResultData<WinrateDto[]>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, this.calculateWinrates)
  }

  public async getOverallWinrates(year?: number): Promise<WinrateDto[]> {
    const playthroughs = await this.getPlaythroughs({ year })
    return this.calculateWinrates(playthroughs)
  }

  public async getLastPlayed(query: StatsQuery = {}): Promise<StatsResultData<Date | undefined>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs[0]?.playedOn)
  }

  public async getNumPlaysByMonth(query: StatsQuery = {}): Promise<number[]> {
    const playthroughs = await this.getPlaythroughs(query)
    const groupedByMonth: number[] = []
    for (const playthrough of playthroughs) {
      const monthPlayed = playthrough.playedOn.getMonth()
      groupedByMonth[monthPlayed] = (groupedByMonth[monthPlayed] ?? 0) + 1
    }
    return groupedByMonth
  }

  public async getNumUniqueGamesPlayed(year?: number | undefined): Promise<number> {
    const playthroughs = await this.getPlaythroughs({ year })
    const uniqueGames = new Set<GameId>()
    playthroughs.forEach(playthrough => uniqueGames.add(playthrough.gameId))
    return uniqueGames.size
  }
  
  public async getScoreStats(query: StatsQuery = {}): Promise<StatsResultData<ScoreStatsDto | undefined>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, this.calculateScoreStats)
  }


  //
  // protected and private
  // =====================


  protected getDateRangeFromYear(year: number): { fromDate: Date, toDate: Date } {
    const fromDate = new Date(year, 0, 1)
    return {
      fromDate,
      toDate: endOfYear(fromDate)
    }
  }

  private async getPlaythroughs({ gameId, year }: StatsQuery): Promise<readonly PlaythroughDto[]> {
    let query: PlaythroughQueryOptions  = { gameId }

    // add date range to query if year is specified
    if (year !== undefined) {
      const dateRange = this.getDateRangeFromYear(year)
      query = { ...query, ...dateRange }
    }
    
    const playthroughs = await this._playthroughService.getPlaythroughs(query)
    return playthroughs
  }

  private groupedByGame(playthroughs: ReadonlyArray<PlaythroughDto>): Record<GameId, PlaythroughDto[]> {
    const grouped: Record<GameId, PlaythroughDto[]> = {}

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
    grouped: Record<GameId, PlaythroughDto[]>,
    reduce: (group: PlaythroughDto[]) => TOut
  ): StatsResultData<TOut> {

    const result: StatsResultData<TOut> = {}
    for (const id in grouped) {
      const gameId = id as GameId
      const group = grouped[gameId]
      result[gameId] = reduce(group)
    }

    return result
  }

  private calculateWinrates(playthroughs: ReadonlyArray<PlaythroughDto>): WinrateDto[] {
    // 1. store for each player how many plays and wins they got
    const allStats = new Map<PlayerId, {plays: number, wins: number}>()
    for (const playthrough of playthroughs) {
      
      // a. set/update play for each player in this playthrough
      // tied games are ignored
      if (playthrough.result !== null) {
        playthrough.players.forEach(playerId => {
          const playerStats = allStats.get(playerId)
          if (playerStats) {
            playerStats.plays++
          } else {
            allStats.set(playerId, {wins: 0, plays: 1})
          }
        })
      }

      // b. update wins count based on playthrough result
      // make sure to check if result is a string (it can be null which means a tie)
      if (playthrough.gameType === GameType.VS && typeof playthrough.result === 'string') {
        const playerId = playthrough.result
        const stats = allStats.get(playerId)!
        stats.wins++
      }
      // make sure to check if result equal to true (it can be null which means a tie)
      else if (playthrough.gameType === GameType.COOP) {
        const playersWon = playthrough.result === true
        if (playersWon) {
          playthrough.players.forEach(playerId => {
            allStats.get(playerId)!.wins++
          })
        }
      }
    }

    // 2. once all plays and wins are counted then we calculate winrates for each player
    const winrates: WinrateDto[] = []
    for (const [playerId, stats] of allStats) {
      winrates.push({ playerId, winrate: stats.wins / stats.plays })
    }

    return winrates
  }

  // assume all playthroughs are of the same game
  private calculateScoreStats(playthroughs: ReadonlyArray<PlaythroughDto>): ScoreStatsDto | undefined {
    if (playthroughs.length === 0) {
      return undefined
    }

    const { gameType } = playthroughs[0]

    if (gameType === GameType.COOP) {
      const allScores = playthroughs.reduce((scores, playthrough) =>
        typeof playthrough.scores === 'number'
          ? [ ...scores, playthrough.scores ]
          : scores
      , [] as number[])

      if (allScores.length === 0) {
        return undefined
      }

      return {
        highScore: { score: ArrayUtils.best(allScores, (a, b) => a > b ? a : b) },
        lowScore: { score: ArrayUtils.best(allScores, (a, b) => a < b ? a : b) },
        averageScore: ArrayUtils.average(allScores)
      }
    }

    else if (gameType === GameType.VS) {
      const allScores = playthroughs.reduce((scores, playthrough) =>
        typeof playthrough.scores === 'object'
          ? scores.concat(playthrough.scores)
          : scores
      , [] as ScoreDto[])

      if (allScores.length === 0) {
        return undefined
      }

      return {
        highScore: ArrayUtils.best(allScores, (a, b) => a.score > b.score ? a : b),
        lowScore: ArrayUtils.best(allScores, (a, b) => a.score < b.score ? a : b),
        averageScore: ArrayUtils.average(allScores.map(s => s.score))
      }
    }

    else {
      throw new Error('calculateScoreStats does not support this game type')
    }
  }

}