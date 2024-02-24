import { playerColorClass } from '@app/helpers'
import type { PlayerId } from '@gamekeeper/core'
import type { ReactNode } from 'react'


type Props = {
  playerId: PlayerId | undefined
  children: ReactNode
}


/**
 * Colorize text based on the player
 */
export function PlayerColor({ playerId, children }: Props) {
  return (
    <span className={playerColorClass(playerId)}>{children}</span>
  )
}