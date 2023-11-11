import { DbGameService } from 'GameService'
import { DataService } from './DataService'
import { GameService, PlayerService, PlaythroughService, Services } from 'core'
import { DbPlayerService } from 'PlayerService'
import { DbPlaythroughService } from 'PlaythroughService'


export class DbServices implements Services {

  public readonly gameService: GameService
  public readonly playerService: PlayerService
  public readonly playthroughService: PlaythroughService

  public constructor(path: string) {
    const dataService = new DataService(path)

    this.gameService = new DbGameService(dataService)
    this.playerService = new DbPlayerService(dataService)
    this.playthroughService = new DbPlaythroughService(dataService)
  }
  

}