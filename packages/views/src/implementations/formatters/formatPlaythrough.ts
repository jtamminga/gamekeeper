import type { FormatPlaythroughOptions, FormattedPlaythrough } from '@def/models'
import { PlayerId, Playthrough, VsPlaythrough } from '@gamekeeper/core'
import { formatDate } from './formatDate'
import { formatScores } from './formatScores'
import { formatPlayerName } from './formatPlayerName'

export function formatPlaythrough(
  playthrough: Playthrough,
  options?: FormatPlaythroughOptions
): FormattedPlaythrough {
  const formatted: FormattedPlaythrough = {
    id: playthrough.id,
    gameId: playthrough.gameId,
    playedOn: formatDate(playthrough.playedOn),
    winner: formatPlayerName(playthrough),
    winnerId: toWinnerId(playthrough),
  }

  if (options?.gameNames) {
    formatted.game = playthrough.game.name
  }
  if (options?.scores) {
    formatted.scores = formatScores(playthrough)
  }
  if (options?.notes) {
    formatted.notes = playthrough.notes
  }

  return formatted
}

function toWinnerId(playthrough: Playthrough): PlayerId | undefined {
  return playthrough instanceof VsPlaythrough
    ? playthrough.winnerId ?? undefined
    : undefined
}