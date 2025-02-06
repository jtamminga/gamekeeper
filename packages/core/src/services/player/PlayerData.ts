import { InvalidState, type NewData, type Opaque } from '@core'


export type PlayerId = Opaque<string, 'PlayerId'>

export enum PlayerColor {
  GREEN = 1,
  ORANGE = 2,
  BLUE = 3,
  PURPLE = 4,
  RED = 5,
  YELLOW = 6
}

export namespace PlayerColor {
  export function toString(color: PlayerColor) {
    switch (color) {
      case PlayerColor.GREEN: return 'green'
      case PlayerColor.ORANGE: return 'orange'
      case PlayerColor.BLUE: return 'blue'
      case PlayerColor.PURPLE: return 'purple'
      case PlayerColor.RED: return 'red'
      case PlayerColor.YELLOW: return 'yellow'
    }
  }
}

export interface PlayerData {
  id: PlayerId
  name: string
  color?: PlayerColor
}

export type NewPlayerData = NewData<PlayerData>

export type UpdatedPlayerData = {
  id: PlayerId
  name?: string
  color?: PlayerColor
}

export namespace NewPlayerData {
  export function errors(data: NewPlayerData): string[] {
    const errors: string[] = []
    
    if (!data.name) {
      errors.push('name is required')
    }

    return errors
  }

  export function throwIfInvalid(data: NewPlayerData): void {
    const errors = NewPlayerData.errors(data)
    if (errors.length > 0) {
      throw new InvalidState(errors)
    }
  }
}

export namespace PlayerData {
  export function errors(data: PlayerData): string[] {
    const errors: string[] = []
    
    if (!data.id) {
      errors.push('id is required')
    }

    return NewPlayerData.errors(data).concat(errors)
  }

  export function throwIfInvalid(data: PlayerData): void {
    const errors = PlayerData.errors(data)
    if (errors.length > 0) {
      throw new InvalidState(errors)
    }
  }
}