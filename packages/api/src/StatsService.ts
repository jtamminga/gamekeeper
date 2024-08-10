import { GameId, StatsQuery, StatsResultData, StatsService, WinrateDto, Route, ScoreStatsDto, PlaysByDateDto } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { toCleanQuery } from './utils'


type ApiLastPlayedDto = StatsResultData<string | undefined>
type ApiPlaysByDateDto = {
  date: string
  plays: number
}


// stats service
export class ApiStatsService extends ApiService implements StatsService {

  public async getNumPlays(query: StatsQuery = {}): Promise<StatsResultData<number>> {
    return this.apiClient.get(Route.STATS.NUM_PLAYTHROUGHS, toCleanQuery(query))
  }

  public async getWinrates(query: StatsQuery = {}): Promise<StatsResultData<WinrateDto[]>> {
    return this.apiClient.get(Route.STATS.WINRATES, toCleanQuery(query))
  }

  public async getOverallWinrates(query: StatsQuery = {}): Promise<WinrateDto[]> {
    return this.apiClient.get(Route.STATS.OVERALL_WINRATES, toCleanQuery(query))
  }

  public async getLastPlayed(query: StatsQuery = {}): Promise<StatsResultData<Date | undefined>> {
    const result = await this.apiClient.get<ApiLastPlayedDto>(Route.STATS.LAST_PLAYTHROUGHS, toCleanQuery(query))

    const lastPlayed: StatsResultData<Date | undefined> = {}
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
  
  public async getScoreStats(query?: StatsQuery | undefined): Promise<StatsResultData<ScoreStatsDto | undefined>> {
    return await this.apiClient.get(Route.STATS.SCORE_STATS, toCleanQuery(query))
  }

  public async getNumPlaysByDate(query?: StatsQuery): Promise<PlaysByDateDto[]> {
    const result = await this.apiClient.get<ApiPlaysByDateDto[]>(Route.STATS.NUM_PLAYS_BY_DATE, toCleanQuery(query))
    return result.map(item => ({
      date: new Date(item.date),
      plays: item.plays
    }))
  }

}