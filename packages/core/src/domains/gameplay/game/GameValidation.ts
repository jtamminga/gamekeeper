import { InvalidState } from '@core'
import { GameData, GameType, NewGameData } from '@services'

export namespace GameValidation {
  export function create(data: NewGameData): void {
    if (!data.name) {
      throw new InvalidState('name')
    }
    if (data.scoring === undefined || data.scoring < 1 || data.scoring > 3 ) {
      throw new InvalidState('scoring')
    }
    if (data.type !== GameType.VS && data.type !== GameType.COOP) {
      throw new InvalidState('type')
    }
    if (data.weight !== undefined && (data.weight < 0 || data.weight > 5)) {
      throw new InvalidState('weight')
    }
  }

  export function update(data: GameData): void {
    if (!data.id) {
      throw new InvalidState('id')
    }
    create(data)
  }
}