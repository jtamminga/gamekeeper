import type { Services } from '@gamekeeper/core'
import { DataService } from './DataService'
import { DbGameService } from './GameService'
import { DbPlayerService } from './PlayerService'
import { DbPlaythroughService } from './PlaythroughService'
import { DbStatsService } from './StatsService'
import { DbGoalService } from './GoalService'


export class DbServices implements Services {

  public readonly gameService: DbGameService
  public readonly playerService: DbPlayerService
  public readonly playthroughService: DbPlaythroughService
  public readonly goalService: DbGoalService
  public readonly statsService: DbStatsService

  public constructor(path: string) {
    const dataService = new DataService(path)

    this.gameService = new DbGameService(dataService)
    this.playerService = new DbPlayerService(dataService)
    this.playthroughService = new DbPlaythroughService(dataService)
    this.goalService = new DbGoalService(dataService)
    this.statsService = new DbStatsService(dataService, this.playthroughService)
  }
}