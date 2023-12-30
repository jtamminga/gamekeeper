import {
  StatsQuery,
  StatsResult,
  StatsService,
  WinrateDto
} from '@gamekeeper/core'
import { DbService } from './DbService'


// stats service
// TODO: implement stats service
export class DbStatsService extends DbService implements StatsService {

  public async getNumPlaythroughs(query: StatsQuery): Promise<StatsResult<number>> {
    throw new Error('Method not implemented.')
  }

  public async getWinrates(query: StatsQuery): Promise<StatsResult<WinrateDto[]>> {
    throw new Error('Method not implemented.')
  }

  public async getLastPlaythroughs(query: StatsQuery): Promise<StatsResult<Date | undefined>> {
    throw new Error('Method not implemented.')
  }

}