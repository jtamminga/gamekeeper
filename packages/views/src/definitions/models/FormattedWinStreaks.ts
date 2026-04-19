import type { GameId, PlayerId } from '@gamekeeper/core'

export type FormattedBestWinStreaks = {
  bestCurrentStreak: { playerId: PlayerId, playerName: string, streak: number }
  bestStreak: { playerId: PlayerId, playerName: string, streak: number, startDate?: string }
}
export type FormattedWinStreakForGame = {
  playerId: PlayerId
  playerName: string
  gameId: GameId
  gameName: string
  streak: number
}