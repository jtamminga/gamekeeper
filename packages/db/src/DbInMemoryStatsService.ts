
import {
  DateUtils,
  InMemoryStats,
  PlaysByDateData,
  PlayStreakData,
  PlaythroughData,
  PlaythroughQueryOptions,
  PlayerWinrateData,
  CoopWinratesData,
  ScoreStatsData,
  StatPerGame,
  StatsQuery,
  StatsService
} from '@gamekeeper/core'
import { DbPlaythroughService } from './PlaythroughService'
import { UserId } from './User'


/**
 * Simple implementation using the playthrough service
 */
export class DbInMemoryStatsService implements StatsService {

  public constructor(
    private _inMemoryStats: InMemoryStats,
    private _dbPlaythroughService: DbPlaythroughService
  ) {
  }


  //
  // StatsService implementations
  // ============================


  public async getNumPlays(query: StatsQuery = {}, userId?: UserId): Promise<StatPerGame<number>> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this._inMemoryStats.getNumPlays(playthroughs)
  }

  public async getWinrates(query: StatsQuery = {}, userId?: UserId): Promise<StatPerGame<PlayerWinrateData[] | CoopWinratesData>> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this._inMemoryStats.getWinrates(playthroughs)
  }

  public async getOverallWinrates(query: StatsQuery = {}, userId?: UserId): Promise<PlayerWinrateData[]> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this._inMemoryStats.getOverallWinrates(playthroughs)
  }

  public async getLastPlayed(query: StatsQuery = {}, userId?: UserId): Promise<StatPerGame<Date | undefined>> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this._inMemoryStats.getLastPlayed(playthroughs)
  }

  public async getNumPlaysByMonth(query: StatsQuery = {}, userId?: UserId): Promise<number[]> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this._inMemoryStats.getNumPlaysByMonth(playthroughs)
  }

  public async getNumUniqueGamesPlayed(year?: number | undefined, userId?: UserId): Promise<number> {
    const playthroughs = await this.getPlaythroughs({ year }, userId)
    return this._inMemoryStats.getNumUniqueGamesPlayed(playthroughs)
  }
  
  public async getScoreStats(query: StatsQuery = {}, userId?: UserId): Promise<StatPerGame<ScoreStatsData | undefined>> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this._inMemoryStats.getScoreStats(playthroughs)
  }

  public async getNumPlaysByDate(query: StatsQuery = {}, userId?: UserId): Promise<PlaysByDateData[]> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this._inMemoryStats.getNumPlaysByDate(playthroughs)
  }

  public async getPlayStreak(query: StatsQuery = {}, userId?: UserId): Promise<PlayStreakData> {
    const playthroughs = await this.getPlaythroughs(query, userId)
    return this._inMemoryStats.getPlayStreak(playthroughs)
  }


  //
  // protected and private
  // =====================


  private async getPlaythroughs({ gameId, year, latestPlaythroughs }: StatsQuery, userId?: UserId): Promise<readonly PlaythroughData[]> {
    let query: PlaythroughQueryOptions  = { gameId }

    // add date range to query if year is specified
    if (year !== undefined) {
      const dateRange = DateUtils.getDateRangeFromYear(year)
      query = { ...query, ...dateRange }
    }

    if (latestPlaythroughs !== undefined) {
      query.limit = latestPlaythroughs
    }
    
    const playthroughs = await this._dbPlaythroughService.getPlaythroughs(query, userId)
    return playthroughs
  }
}