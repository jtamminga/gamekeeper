import type { GameId, StatsQuery, StatPerGame, StatsService, PlayerWinrateData, CoopWinratesData, HistoricalScoreData, ScoreStatsData, PlaysByDateData, PlayStreakData } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { encodeStatsQuery } from './queryParams'
import { Route } from '@gamekeeper/views'


type ApiLastPlayedDto = StatPerGame<string | undefined>
type ApiPlaysByDateDto = {
  date: string
  plays: number
}

type ApiPlayStreakDto = {
  bestStreak: number
  bestStart?: string
  currentStreak: number
}


// stats service
export class ApiStatsService extends ApiService implements StatsService {

  public async getNumPlays(query: StatsQuery = {}): Promise<StatPerGame<number>> {
    return this.apiClient.get(Route.STATS.NUM_PLAYTHROUGHS, encodeStatsQuery(query))
  }

  public async getWinrates(query: StatsQuery = {}): Promise<StatPerGame<PlayerWinrateData[] | CoopWinratesData>> {
    return this.apiClient.get(Route.STATS.WINRATES, encodeStatsQuery(query))
  }

  public async getOverallWinrates(query: StatsQuery = {}): Promise<PlayerWinrateData[]> {
    return this.apiClient.get(Route.STATS.OVERALL_WINRATES, encodeStatsQuery(query))
  }

  public async getLastPlayed(query: StatsQuery = {}): Promise<StatPerGame<Date | undefined>> {
    const result = await this.apiClient.get<ApiLastPlayedDto>(Route.STATS.LAST_PLAYTHROUGHS, encodeStatsQuery(query))

    const lastPlayed: StatPerGame<Date | undefined> = {}
    for (const id in result) {
      const gameId = id as GameId
      const dateStr = result[gameId]
      lastPlayed[gameId] = dateStr ? new Date(dateStr) : undefined
    }

    return lastPlayed
  }

  public async getNumPlaysByMonth(query?: StatsQuery | undefined): Promise<number[]> {
    return await this.apiClient.get(Route.STATS.PLAYS_BY_MONTH, encodeStatsQuery(query))
  }

  public async getNumUniqueGamesPlayed(year?: number | undefined): Promise<number> {
    return await this.apiClient.get(Route.STATS.NUM_UNIQUE_GAMES_PLAYED, encodeStatsQuery({ year }))
  }
  
  public async getScoreStats(query?: StatsQuery | undefined): Promise<StatPerGame<ScoreStatsData | undefined>> {
    return await this.apiClient.get(Route.STATS.SCORE_STATS, encodeStatsQuery(query))
  }

  public async getHistoricalScores(query?: StatsQuery): Promise<StatPerGame<HistoricalScoreData[]>> {
    return await this.apiClient.get(Route.STATS.HISTORICAL_SCORES, encodeStatsQuery(query))
  }

  public async getNumPlaysByDate(query?: StatsQuery): Promise<PlaysByDateData[]> {
    const result = await this.apiClient.get<ApiPlaysByDateDto[]>(Route.STATS.NUM_PLAYS_BY_DATE, encodeStatsQuery(query))
    return result.map(item => ({
      date: new Date(item.date),
      plays: item.plays
    }))
  }

  public async getPlayStreak(query?: StatsQuery): Promise<PlayStreakData> {
    const result = await this.apiClient.get<ApiPlayStreakDto>(Route.STATS.PLAY_STREAK, encodeStatsQuery(query))
    return {
      bestStreak: result.bestStreak,
      bestStart: result.bestStart ? new Date(result.bestStart) : undefined,
      currentStreak: result.currentStreak
    }
  }

}