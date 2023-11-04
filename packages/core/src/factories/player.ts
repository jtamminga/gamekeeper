import { Player } from '@domains'
import { PlayerDto } from '@services'

export namespace PlayerFactory {
  export function create(dto: PlayerDto): Player {
    return new Player(dto)
  }
}