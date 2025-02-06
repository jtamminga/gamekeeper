import { InvalidState, type NewData, type Opaque } from '@core'
import type { GameId } from '../game'
import type { PlayerId } from '../player'
import type { ScoreData } from './ScoreData'


export type PlaythroughId = Opaque<string, 'PlaythroughId'>


// base types
export interface BasePlaythroughData {
  id: PlaythroughId
  gameId: GameId
  playerIds: ReadonlyArray<PlayerId>
  playedOn: Date
}
export type NewBasePlaythroughData = NewData<BasePlaythroughData>


// vs types
export interface VsPlaythroughData extends BasePlaythroughData {
  type: 'vs'
  winnerId: PlayerId | null
  scores?: ReadonlyArray<ScoreData>
}
export type NewVsPlaythroughData = NewData<VsPlaythroughData>


// coop types
export interface CoopPlaythroughData extends BasePlaythroughData {
  type: 'coop'
  playersWon: boolean
  score?: number
}
export type NewCoopPlaythroughData = NewData<CoopPlaythroughData>


// types
export type NewPlaythroughData =
  | NewVsPlaythroughData
  | NewCoopPlaythroughData

export type PlaythroughData =
  | VsPlaythroughData
  | CoopPlaythroughData


// guards
export namespace VsPlaythroughData {
  export function guard(data: PlaythroughData): data is VsPlaythroughData {
    return data.type === 'vs'
  }
  export function guardNew(data: NewPlaythroughData): data is NewVsPlaythroughData {
    return data.type === 'vs'
  }
}

export namespace CoopPlaythroughData {
  export function guard(data: PlaythroughData): data is CoopPlaythroughData {
    return data.type === 'coop'
  }
  export function guardNew(data: NewPlaythroughData): data is NewCoopPlaythroughData {
    return data.type === 'coop'
  }
}

export namespace NewBasePlaythroughData {
  export function errors(data: NewBasePlaythroughData): string[] {
    const errors: string[] = []
    
    if (!data.gameId) {
      errors.push('gameId is required')
    }
    if (!data.playedOn) {
      errors.push('playedOn is required')
    }
    if (!data.playerIds) {
      errors.push('playerIds is required')
    }
    if (data.playerIds.length === 0) {
      errors.push('playerIds must have at least one player')
    }

    return errors
  }

  export function throwIfInvalid(data: NewBasePlaythroughData): void {
    const errors = NewBasePlaythroughData.errors(data)
    if (errors.length > 0) {
      throw new InvalidState(errors)
    }
  }
}

export namespace NewPlaythroughData {
  export function errors(data: NewPlaythroughData): string[] {
    const errors: string[] = []
    if (!data.type || (data.type !== 'coop' && data.type !== 'vs')) {
      errors.push('type must be either coop or vs')
    }

    return NewBasePlaythroughData.errors(data).concat(errors)
  }

  export function throwIfInvalid(data: NewPlaythroughData): void {
    const errors = NewPlaythroughData.errors(data)
    if (errors.length > 0) {
      throw new InvalidState(errors)
    }
  }
}