import type { NewData, Opaque } from '@core'


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