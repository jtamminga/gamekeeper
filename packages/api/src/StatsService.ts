import { GameId, StatsQuery, StatPerGame, StatsService, WinrateDto, ScoreStatsDto, PlaysByDateDto, PlayStreakDto } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { toCleanQuery } from './utils'
import { Route } from '@gamekeeper/views'


type ApiLastPlayedDto = StatPerGame<string | undefined>
type ApiPlaysByDateDto = {
  date: string
  plays: number
}

type ApiPlayStreakDto = {
  bestStreak: number
  bestStart: string
  currentStreak: number
}


// stats service
export class ApiStatsService extends ApiService implements StatsService {

  public async getNumPlays(query: StatsQuery = {}): Promise<StatPerGame<number>> {
    return this.apiClient.get(Route.STATS.NUM_PLAYTHROUGHS, toCleanQuery(query))
  }

  public async getWinrates(query: StatsQuery = {}): Promise<StatPerGame<WinrateDto[]>> {
    return this.apiClient.get(Route.STATS.WINRATES, toCleanQuery(query))
  }

  public async getOverallWinrates(query: StatsQuery = {}): Promise<WinrateDto[]> {
    return this.apiClient.get(Route.STATS.OVERALL_WINRATES, toCleanQuery(query))
  }

  public async getLastPlayed(query: StatsQuery = {}): Promise<StatPerGame<Date | undefined>> {
    const result = await this.apiClient.get<ApiLastPlayedDto>(Route.STATS.LAST_PLAYTHROUGHS, toCleanQuery(query))

    const lastPlayed: StatPerGame<Date | undefined> = {}
    for (const id in result) {
      const gameId = id as GameId
      const dateStr = result[gameId]
      lastPlayed[gameId] = dateStr ? new Date(dateStr) : undefined
    }

    return lastPlayed
  }

  public async getNumPlaysByMonth(query?: StatsQuery | undefined): Promise<number[]> {
    return await this.apiClient.get(Route.STATS.PLAYS_BY_MONTH, toCleanQuery(query))
  }

  public async getNumUniqueGamesPlayed(year?: number | undefined): Promise<number> {
    return await this.apiClient.get(Route.STATS.NUM_UNIQUE_GAMES_PLAYED, toCleanQuery({ year }))
  }
  
  public async getScoreStats(query?: StatsQuery | undefined): Promise<StatPerGame<ScoreStatsDto | undefined>> {
    return await this.apiClient.get(Route.STATS.SCORE_STATS, toCleanQuery(query))
  }

  public async getNumPlaysByDate(query?: StatsQuery): Promise<PlaysByDateDto[]> {
    const result = await this.apiClient.get<ApiPlaysByDateDto[]>(Route.STATS.NUM_PLAYS_BY_DATE, toCleanQuery(query))
    return result.map(item => ({
      date: new Date(item.date),
      plays: item.plays
    }))
  }

  public async getPlayStreak(query?: StatsQuery): Promise<PlayStreakDto> {
    const result = await this.apiClient.get<ApiPlayStreakDto>(Route.STATS.PLAY_STREAK, toCleanQuery(query))
    return {
      bestStreak: result.bestStreak,
      bestStart: new Date(result.bestStart),
      currentStreak: result.currentStreak
    }
  }

}