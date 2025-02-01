import { PlayerColor } from '@gamekeeper/core'


export function playerColorClass(color: PlayerColor | undefined): string {
  const colorText = color === undefined
    ? 'none'
    : PlayerColor.toString(color)

  return `player-color-${colorText}`
}