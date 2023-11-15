import type { GameService } from './game'
import type { PlayerService } from './player'
import type { PlaythroughService } from './playthrough'
import type { StatsService } from './stats'


export interface Services {

  gameService: GameService
  playerService: PlayerService
  playthroughService: PlaythroughService
  statsService: StatsService

}