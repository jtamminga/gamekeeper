import { CoopPlaythroughData, PlaythroughDto, PlaythroughQueryOptions, PlaythroughService, VsPlaythroughData } from '@gamekeeper/core'
import { ApiService } from 'ApiService'
import { Route } from 'Route'


// playthrough service
export class ApiPlaythroughService extends ApiService implements PlaythroughService {

  public async getPlaythroughs(options?: PlaythroughQueryOptions): Promise<readonly PlaythroughDto[]> {
    return this.apiClient.get(Route.PLAYTHROUGHS)
  }

  public async addPlaythrough(playthrough: VsPlaythroughData | CoopPlaythroughData): Promise<PlaythroughDto> {
    return this.apiClient.post(Route.PLAYTHROUGHS, playthrough)
  }

}