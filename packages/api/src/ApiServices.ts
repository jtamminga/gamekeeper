import { GameService, GoalService, PlayerService, PlaythroughService, Services, StatsService } from '@gamekeeper/core'
import { ApiClient } from './ApiClient'
import { ApiGameService } from './GameService'
import { ApiPlayerService } from './PlayerService'
import { ApiPlaythroughService } from './PlaythroughService'
import { ApiStatsService } from './StatsService'
import { ApiCachingClient } from './ApiCachingClient'
import { ApiGoalService } from './GoalService'


export class ApiServices implements Services {

  public readonly gameService: GameService
  public readonly playerService: PlayerService
  public readonly playthroughService: PlaythroughService
  public readonly goalService: GoalService
  public readonly statsService: StatsService

  public constructor(baseUrl: string) {
    const apiClient = new ApiClient(baseUrl)
    const cachingClient = new ApiCachingClient(apiClient)

    this.gameService = new ApiGameService(cachingClient)
    this.playerService = new ApiPlayerService(cachingClient)
    this.playthroughService = new ApiPlaythroughService(cachingClient)
    this.goalService = new ApiGoalService(cachingClient)
    this.statsService = new ApiStatsService(cachingClient)
  }
  
}