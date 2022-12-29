import { GameData, PlayerData } from 'gamekeeper-core'


// types
export type GameApiResponse = {
  games: ReadonlyArray<GameData>
}

export type RecordApiResponse = {
  games: ReadonlyArray<GameData>
  players: ReadonlyArray<PlayerData>
}

export type RecordData = {
  games: ReadonlyArray<GameData>
  players: ReadonlyArray<PlayerData>
}