
import { endOfYear, isSameDay } from 'date-fns'
import {
  ArrayUtils,
  CoopPlaythroughData,
  GameId,
  PlayerId,
  PlaysByDateDto,
  PlaythroughData,
  PlaythroughQueryOptions,
  ScoreData,
  ScoreStatsDto,
  StatsQuery,
  StatsResultData,
  StatsService,
  VsPlaythroughData,
  WinrateDto
} from '@gamekeeper/core'
import { UserId } from './User'
import { DbPlaythroughService } from './PlaythroughService'


/**
 * Simple implementation using the playthrough service
 */
export class SimpleStatsService implements StatsService {

  public constructor(
    private _playthroughService: DbPlaythroughService
  ) { }


  //
  // StatsService implementations
  // ============================


  public async getNumPlays(query: StatsQuery = {}, userId?: UserId): Promise<StatsResultData<number>> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs.length)
  }

  public async getWinrates(query: StatsQuery = {}, userId?: UserId): Promise<StatsResultData<WinrateDto[]>> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, this.calculateWinrates)
  }

  public async getOverallWinrates(query: StatsQuery = {}, userId?: UserId): Promise<WinrateDto[]> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this.calculateWinrates(playthroughs)
  }

  public async getLastPlayed(query: StatsQuery = {}, userId?: UserId): Promise<StatsResultData<Date | undefined>> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs[0]?.playedOn)
  }

  public async getNumPlaysByMonth(query: StatsQuery = {}, userId?: UserId): Promise<number[]> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    const groupedByMonth: number[] = []
    for (const playthrough of playthroughs) {
      const monthPlayed = playthrough.playedOn.getMonth()
      groupedByMonth[monthPlayed] = (groupedByMonth[monthPlayed] ?? 0) + 1
    }
    return groupedByMonth
  }

  public async getNumUniqueGamesPlayed(year?: number | undefined, userId?: UserId): Promise<number> {
    const playthroughs = await this.getPlaythroughs({ year }, userId)
    const uniqueGames = new Set<GameId>()
    playthroughs.forEach(playthrough => uniqueGames.add(playthrough.gameId))
    return uniqueGames.size
  }
  
  public async getScoreStats(query: StatsQuery = {}, userId?: UserId): Promise<StatsResultData<ScoreStatsDto | undefined>> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, this.calculateScoreStats)
  }

  public async getNumPlaysByDate(query: StatsQuery = {}, userId?: UserId): Promise<PlaysByDateDto[]> {
    // by default playthroughs are ordered by played_on date desc
    const playthroughs = [...await this.getPlaythroughs(query, userId)].reverse()
    const result: PlaysByDateDto[] = []
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

  private async getPlaythroughs({ gameId, year, latestPlaythroughs }: StatsQuery, userId?: UserId): Promise<readonly PlaythroughData[]> {
    let query: PlaythroughQueryOptions  = { gameId }

    // add date range to query if year is specified
    if (year !== undefined) {
      const dateRange = this.getDateRangeFromYear(year)
      query = { ...query, ...dateRange }
    }

    if (latestPlaythroughs !== undefined) {
      query.limit = latestPlaythroughs
    }
    
    const playthroughs = await this._playthroughService.getPlaythroughs(query, userId)
    return playthroughs
  }

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
  ): StatsResultData<TOut> {

    const result: StatsResultData<TOut> = {}
    for (const id in grouped) {
      const gameId = id as GameId
      const group = grouped[gameId]
      result[gameId] = reduce(group)
    }

    return result
  }

  private calculateWinrates(playthroughs: ReadonlyArray<PlaythroughData>): WinrateDto[] {
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
    const winrates: WinrateDto[] = []
    for (const [playerId, stats] of allStats) {
      winrates.push({ playerId, winrate: stats.wins / stats.plays })
    }

    return winrates
  }

  // assume all playthroughs are of the same game
  private calculateScoreStats(playthroughs: ReadonlyArray<PlaythroughData>): ScoreStatsDto | undefined {
    if (playthroughs.length === 0) {
      return undefined
    }

    const gameType = playthroughs[0].type

    if (gameType === 'vs') {
      const allScores = (playthroughs as ReadonlyArray<VsPlaythroughData>)
        .reduce((scores, playthrough) =>
          scores.concat(playthrough.scores ?? [])
        , [] as ScoreData[])

      if (allScores.length === 0) {
        return undefined
      }

      return {
        highScore: ArrayUtils.best(allScores, (a, b) => a.score > b.score ? a : b),
        lowScore: ArrayUtils.best(allScores, (a, b) => a.score < b.score ? a : b),
        averageScore: ArrayUtils.average(allScores.map(s => s.score))
      }
    }

    else if (gameType === "coop") {
      const allScores = (playthroughs as ReadonlyArray<CoopPlaythroughData>)
        .reduce((scores, playthrough) =>
          playthrough.score === undefined
            ? scores
            : scores.concat(playthrough.score)
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

    

    else {
      throw new Error('calculateScoreStats does not support this game type')
    }
  }

}