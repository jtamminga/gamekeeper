import { InvalidState, type NewData, type Opaque } from '@core'


export type GameId = Opaque<string, 'GameId'>

export enum GameType {
  VS = 1,
  COOP = 2
}

export enum ScoringType {
  HIGHEST_WINS = 1,
  LOWEST_WINS = 2,
  NO_SCORE = 3
}

export interface GameData {
  id: GameId
  name: string
  scoring: ScoringType
  type: GameType
  weight?: number
}

export type NewGameData = NewData<GameData>

export type UpdatedGameData = {
  id: GameId
  name?: string
  weight?: number
}


export namespace NewGameData {
  export function errors(data: NewGameData): string[] {
    const errors: string[] = []
    
    if (!data.name) {
      errors.push('name is required')
    }
    if (data.scoring === undefined || data.scoring < 1 || data.scoring > 3 ) {
      errors.push('invalid scoring type')
    }
    if (data.type !== GameType.VS && data.type !== GameType.COOP) {
      errors.push('type must be either vs or coop')
    }
    if (data.weight !== undefined && (data.weight < 0 || data.weight > 5)) {
      errors.push('weight must be between 0 and 5')
    }

    return errors
  }

  export function throwIfInvalid(data: NewGameData): void {
    const errors = NewGameData.errors(data)
    if (errors.length > 0) {
      throw new InvalidState(errors)
    }
  }
} 

export namespace GameData {
  export function errors(data: GameData): string[] {
    const errors: string[] = []
    if (!data.id) {
      errors.push('id is required')
    }

    return NewGameData.errors(data).concat(errors)
  }

  export function throwIfInvalid(data: NewGameData): void {
    const errors = NewGameData.errors(data)
    if (errors.length > 0) {
      throw new InvalidState(errors)
    }
  }
}