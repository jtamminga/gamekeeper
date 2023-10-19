import { DataService } from './data'
import { GameService } from './game'
import { PlayerService } from './player'
import { PlaythroughService } from './playthrough'


// overall service
export class GameKeeperService {

  public readonly gameService: GameService
  public readonly playerService: PlayerService
  public readonly playthroughService: PlaythroughService

  public constructor(private dataService: DataService) {
    this.gameService = new GameService(dataService)
    this.playerService = new PlayerService(dataService)
    this.playthroughService = new PlaythroughService(dataService)
  }
}