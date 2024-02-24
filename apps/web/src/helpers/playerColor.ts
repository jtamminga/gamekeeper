import type { PlayerId } from '@gamekeeper/core'


export function playerColorClass(playerId: PlayerId | undefined): string {
  return `player-${playerId ?? 'none'}`
}