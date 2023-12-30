import { StatsQuery, StatsResult, StatsService, WinrateDto } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { Route } from './Route'
import { toCleanQuery } from './utils'


// stats service
export class ApiStatsService extends ApiService implements StatsService {

  public async getNumPlaythroughs(query: StatsQuery): Promise<StatsResult<number>> {
    return this.apiClient.get(Route.STATS.NUM_PLAYTHROUGHS, toCleanQuery(query))
  }

  public async getWinrates(query: StatsQuery): Promise<StatsResult<WinrateDto[]>> {
    return this.apiClient.get(Route.STATS.WINRATES, toCleanQuery(query))
  }

  public async getLastPlaythroughs(query: StatsQuery): Promise<StatsResult<Date | undefined>> {
    return this.apiClient.get(Route.STATS.LAST_PLAYTHROUGHS, toCleanQuery(query))
  }

}