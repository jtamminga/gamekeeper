import { CoopPlaythrough, Playthrough, VsPlaythrough } from '@gamekeeper/core'

export function formatPlayerName(playthrough: Playthrough): string {
  if (playthrough instanceof VsPlaythrough) {
    return playthrough.winner === undefined
      ? 'tied'
      : playthrough.winner.name
  }

  else if (playthrough instanceof CoopPlaythrough) {
    return playthrough.playersWon
      ? 'players'
      : 'game'
  }

  else {
    throw new Error('unsupported playthrough type')
  }
}