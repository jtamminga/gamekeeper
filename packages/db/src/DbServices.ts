import { DataService } from './DataService'
import { DbGameService } from './GameService'
import { DbPlayerService } from './PlayerService'
import { DbPlaythroughService } from './PlaythroughService'
import { GameService, GoalService, PlayerService, PlaythroughService, Services, StatsService } from '@gamekeeper/core'
import { DbStatsService } from './StatsService'
import { DbGoalService } from './GoalService'


export class DbServices implements Services {

  public readonly gameService: GameService
  public readonly playerService: PlayerService
  public readonly playthroughService: PlaythroughService
  public readonly goalService: GoalService
  public readonly statsService: StatsService

  public constructor(path: string) {
    const dataService = new DataService(path)

    this.gameService = new DbGameService(dataService)
    this.playerService = new DbPlayerService(dataService)
    this.playthroughService = new DbPlaythroughService(dataService)
    this.goalService = new DbGoalService(dataService)
    this.statsService = new DbStatsService(dataService, this.playthroughService)
  }
}