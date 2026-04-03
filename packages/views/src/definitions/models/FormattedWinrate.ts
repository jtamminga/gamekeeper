import type { PlayerId } from '@gamekeeper/core'


export interface FormattedWinrate {

  /**
   * Player id, could be undefined if it's a coop game
   */
  playerId: PlayerId | undefined

  /**
   * Could be player name or 'players', 'game' if coop
   */
  name: string

  /**
   * The percentage formatted
   */
  percentage: string
}