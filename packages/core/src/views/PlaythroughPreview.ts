import { CoopPlaythrough, Playthrough, VsPlaythrough } from '@domains'
import { formatDate } from './utils'
import type { PlayerId } from '@services'


export type FormattedScore = { name: string, score: string, playerId?: PlayerId }
export type FormattedPlaythrough = {
  id: string
  game?: string
  playedOn: string
  winner: string
  winnerId?: PlayerId
  scores: FormattedScore[]
}


export function formatPlaythroughs(playthroughs: ReadonlyArray<Playthrough>, includeGameNames = false): ReadonlyArray<FormattedPlaythrough> {
  return playthroughs.map(playthrough => {
    const formatted: FormattedPlaythrough = {
      id: playthrough.id,
      playedOn: formatDate(playthrough.playedOn),
      winner: toWinnerName(playthrough),
      winnerId: toWinnerId(playthrough),
      scores: formatScores(playthrough)
    }

    if (includeGameNames) {
      formatted.game = playthrough.game.name
    }

    return formatted
  })
}

export function toWinnerName(playthrough: Playthrough): string {
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

function toWinnerId(playthrough: Playthrough): PlayerId | undefined {
  return playthrough instanceof VsPlaythrough
    ? playthrough.winnerId ?? undefined
    : undefined
}

function formatScores(playthrough: Playthrough): FormattedScore[] {
  if (playthrough instanceof VsPlaythrough) {
    return playthrough.scores.all.map(score => ({
      name: score.player.name,
      score: score.value.toString(),
      playerId: score.player.id
    }))
  }
  else if (playthrough instanceof CoopPlaythrough) {
    return playthrough.score === undefined
      ? []
      : [{ name: 'players', score: playthrough.score.toString() }]
  }
  else {
    throw new Error('unsupported playthrough type')
  }
}

