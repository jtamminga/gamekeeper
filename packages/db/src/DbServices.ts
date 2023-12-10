import { DataService } from './DataService'
import { DbGameService } from './GameService'
import { DbPlayerService } from './PlayerService'
import { DbPlaythroughService } from './PlaythroughService'
import { DbStatsService } from './StatsService'
import { GameService, PlayerService, PlaythroughService, Services, StatsService } from '@gamekeeper/core'


export class DbServices implements Services {

  public readonly gameService: GameService
  public readonly playerService: PlayerService
  public readonly playthroughService: PlaythroughService
  public readonly statsService: StatsService

  public constructor(path: string) {
    const dataService = new DataService(path)

    this.gameService = new DbGameService(dataService)
    this.playerService = new DbPlayerService(dataService)
    this.playthroughService = new DbPlaythroughService(dataService)
    this.statsService = new DbStatsService(this.playthroughService)
  }
}