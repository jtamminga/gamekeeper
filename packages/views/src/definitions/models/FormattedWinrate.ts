import type { PlayerId } from '@gamekeeper/core'


export interface FormattedWinrate {
  /**
   * Player id, could be undefined if it's a coop game
   */
  playerId: PlayerId | undefined
  playerName: string
  percentage: string
}