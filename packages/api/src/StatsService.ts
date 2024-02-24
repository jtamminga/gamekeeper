import { GameId, StatsQuery, StatsResultData, StatsService, WinrateDto, Route } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { toCleanQuery } from './utils'


type ApiLastPlayedDto = StatsResultData<string | undefined>


// stats service
export class ApiStatsService extends ApiService implements StatsService {

  public async getNumPlays(query: StatsQuery = {}): Promise<StatsResultData<number>> {
    return this.apiClient.get(Route.STATS.NUM_PLAYTHROUGHS, toCleanQuery(query))
  }

  public async getWinrates(query: StatsQuery = {}): Promise<StatsResultData<WinrateDto[]>> {
    return this.apiClient.get(Route.STATS.WINRATES, toCleanQuery(query))
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
    throw new Error('Method not implemented.')
  }

}