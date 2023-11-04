import type { GameService } from './game'
import type { PlayerService } from './player'
import type { PlaythroughService } from './playthrough'


export interface Services {

  gameService: GameService
  playerService: PlayerService
  playthroughService: PlaythroughService

}