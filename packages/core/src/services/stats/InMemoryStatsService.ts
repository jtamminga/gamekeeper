import { DateUtils } from '@core'
import type { PlaythroughData, PlaythroughQueryOptions, PlaythroughService } from '../playthrough'
import type { InMemoryStats } from './InMemoryStats'
import type { StatPerGame, StatsQuery, StatsService } from './StatsService'
import type { CoopWinratesData, HistoricalScoreData, PlayerWinrateData, PlaysByDateData, PlayStreakData, ScoreStatsData } from './WinrateData'



/**
 * Simple implementation using the playthrough service all in memory
 */
export class InMemoryStatsService implements StatsService {

  public constructor(
    private _inMemoryStats: InMemoryStats,
    private _playthroughService: PlaythroughService
  ) { }


  //
  // StatsService implementations
  // ============================


  public async getNumPlays(query: StatsQuery = {}): Promise<StatPerGame<number>> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getNumPlays(playthroughs)
  }

  public async getWinrates(query: StatsQuery = {}): Promise<StatPerGame<PlayerWinrateData[] | CoopWinratesData>> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getWinrates(playthroughs)
  }

  public async getOverallWinrates(query: StatsQuery = {}): Promise<PlayerWinrateData[]> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getOverallWinrates(playthroughs)
  }

  public async getLastPlayed(query: StatsQuery = {}): Promise<StatPerGame<Date | undefined>> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getLastPlayed(playthroughs)
  }

  public async getNumPlaysByMonth(query: StatsQuery = {}): Promise<number[]> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getNumPlaysByMonth(playthroughs)
  }

  public async getNumUniqueGamesPlayed(year?: number | undefined): Promise<number> {
    const playthroughs = await this.getPlaythroughs({ year })
    return this._inMemoryStats.getNumUniqueGamesPlayed(playthroughs)
  }
  
  public async getScoreStats(query: StatsQuery = {}): Promise<StatPerGame<ScoreStatsData | undefined>> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getScoreStats(playthroughs)
  }

  public async getHistoricalScores(query: StatsQuery = {}): Promise<StatPerGame<HistoricalScoreData[]>> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getHistoricalScores(playthroughs)
  }

  public async getNumPlaysByDate(query: StatsQuery = {}): Promise<PlaysByDateData[]> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getNumPlaysByDate(playthroughs)
  }

  public async getPlayStreak(query: StatsQuery = {}): Promise<PlayStreakData> {
    const playthroughs = await this.getPlaythroughs(query)
    return this._inMemoryStats.getPlayStreak(playthroughs)
  }


  //
  // protected and private
  // =====================


  private async getPlaythroughs({ gameId, year, latestPlaythroughs }: StatsQuery): Promise<readonly PlaythroughData[]> {
    let query: PlaythroughQueryOptions  = { gameId }

    // add date range to query if year is specified
    if (year !== undefined) {
      const dateRange = DateUtils.getDateRangeFromYear(year)
      query = { ...query, ...dateRange }
    }

    if (latestPlaythroughs !== undefined) {
      query.limit = latestPlaythroughs
    }
    
    const playthroughs = await this._playthroughService.getPlaythroughs(query)
    return playthroughs
  }

}