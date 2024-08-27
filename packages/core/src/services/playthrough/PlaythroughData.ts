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
  winnerId: PlayerId | null
  scores?: ReadonlyArray<ScoreData>
}
export type NewVsPlaythroughData = NewData<VsPlaythroughData>
export namespace VsPlaythroughData {
  export function guard(data: BasePlaythroughData): data is VsPlaythroughData {
    return Object.hasOwn(data, 'winnerId')
  }
}

// coop types
export interface CoopPlaythroughData extends BasePlaythroughData {
  playersWon: boolean
  score?: number
}
export type NewCoopPlaythroughData = NewData<CoopPlaythroughData>
export namespace CoopPlaythroughData {
  export function guard(data: BasePlaythroughData): data is CoopPlaythroughData {
    return Object.hasOwn(data, 'playersWon')
  }
}

// types
export type NewPlaythroughData =
  | NewVsPlaythroughData
  | NewCoopPlaythroughData

export type PlaythroughData =
  | VsPlaythroughData
  | CoopPlaythroughData