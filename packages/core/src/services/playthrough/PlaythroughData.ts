import type { NewData, Opaque } from '@core'
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