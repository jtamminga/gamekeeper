import type { GameId, PlayerId } from '@gamekeeper/core'


export interface PlayerView {
  year: number
  id: PlayerId
  name: string
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