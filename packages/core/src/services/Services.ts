import type { GameService } from './game'
import type { GoalService } from './goal'
import type { PlayerService } from './player'
import type { PlaythroughService } from './playthrough'
import type { StatsService } from './stats'


export interface Services {

  gameService: GameService
  playerService: PlayerService
  playthroughService: PlaythroughService
  goalService: GoalService
  statsService: StatsService

}