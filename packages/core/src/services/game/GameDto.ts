import { Opaque } from "@core"

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

export interface GameDto {
  id: GameId
  name: string
  type: GameType
  scoring: ScoringType
}