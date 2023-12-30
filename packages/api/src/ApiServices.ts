import { GameService, PlayerService, PlaythroughService, Services, StatsService } from '@gamekeeper/core'
import { ApiClient } from './ApiClient'
import { ApiGameService } from './GameService'
import { ApiPlayerService } from './PlayerService'
import { ApiPlaythroughService } from './PlaythroughService'
import { ApiStatsService } from './StatsService'


export class ApiServices implements Services {

  public readonly gameService: GameService
  public readonly playerService: PlayerService
  public readonly playthroughService: PlaythroughService
  public readonly statsService: StatsService

  public constructor(baseUrl: string) {
    const apiClient = new ApiClient(baseUrl)

    this.gameService = new ApiGameService(apiClient)
    this.playerService = new ApiPlayerService(apiClient)
    this.playthroughService = new ApiPlaythroughService(apiClient)
    this.statsService = new ApiStatsService(apiClient)
  }
  
}