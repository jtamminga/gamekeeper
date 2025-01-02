import type { GameId, GameType } from '@gamekeeper/core'

export type GameWithStats = {
  id: GameId
  name: string
  type: GameType
  numPlays: number
  weight: number | undefined
  lastPlayed: Date | undefined
  lastPlayedFormatted: string | undefined
}
export type GameSortBy =
  | 'name'
  | 'numPlays'
  | 'lastPlayed'
  | 'weight'
export type GameSortOrder = 'asc' | 'desc'
export type GetGamesOptions = {
  sortBy?: GameSortBy
  order?: GameSortOrder
}
export interface GamesView {
  games: ReadonlyArray<GameWithStats>
}