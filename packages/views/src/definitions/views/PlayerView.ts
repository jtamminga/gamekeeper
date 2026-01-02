import type { GameId, Player } from '@gamekeeper/core'


export interface PlayerView {
  year: number
  player: Player
  topGamesAllTime: GameWithWinrate[]
  topGamesThisYear: GameWithWinrate[]
  worstGamesAllTime: GameWithWinrate[]
  worstGamesThisYear: GameWithWinrate[]
}


export type GameWithWinrate = {
  gameName: string
  gameId: GameId
  numPlays: number
  percentage: string
}