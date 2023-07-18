import { GameData, GameId, PlayerData, PlayerId } from 'gamekeeper-core'


// types
export type GameApiResponse = {
  games: ReadonlyArray<GameData>
}

export type RecordApiResponse = {
  games: ReadonlyArray<GameData>
  players: ReadonlyArray<PlayerData>
}

export type RecordData = {
  games: Readonly<Record<GameId, GameData>>
  players: Readonly<Record<PlayerId, PlayerData>>
}