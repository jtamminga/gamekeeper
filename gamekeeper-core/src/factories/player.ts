import { Player, PlayerId } from '@domains'
import { PlayerDto } from '@services'

export namespace PlayerFactory {
  export function create({ id: playerId, ...data }: PlayerDto): Player {
    const id = playerId.toString() as PlayerId
    return new Player({id, ...data})
  }
}