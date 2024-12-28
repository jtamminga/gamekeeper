import { GameplayDeps } from '../Gameplay'
import { Player } from './Player'
import type { PlayerData } from '@services'


export namespace PlayerFactory {
  export function create(deps: GameplayDeps, data: PlayerData): Player {
    return new Player(deps, data)
  }
}