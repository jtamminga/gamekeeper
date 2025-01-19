import { InvalidState } from '@core'
import type { NewPlayerData, PlayerData } from '@services'

export namespace PlayerValidation {

  export function create(data: NewPlayerData): void {
    if (!data.name) {
      throw new InvalidState('name')
    }
  }

  export function update(data: PlayerData): void {
    if (!data.id) {
      throw new InvalidState('id')
    }
    create(data)
  }

}