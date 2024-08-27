import { Player } from '@domains'
import type { PlayerData } from '@services'


export namespace PlayerFactory {
  export function create(data: PlayerData): Player {
    return new Player(data)
  }
}