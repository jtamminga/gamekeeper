import { PlayerColor } from '@gamekeeper/core'



export function playerColor(color: PlayerColor | undefined): string {

  const colorLabel = color === undefined
    ? 'none'
    : PlayerColor.toString(color)

  return `var(--player-color-${colorLabel})`
}