import { playerColorClass } from '@app/helpers'
import { useGamekeeper } from '@app/hooks'
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
  const { gameplay } = useGamekeeper()
  const color = playerId
    ? gameplay.players.get(playerId).color
    : undefined

  return (
    <span className={playerColorClass(color)}>{children}</span>
  )
}