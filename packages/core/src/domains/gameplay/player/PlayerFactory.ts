import { Player } from './Player'
import type { PlayerData } from '@services'


export namespace PlayerFactory {
  export function create(data: PlayerData): Player {
    return new Player(data)
  }
}