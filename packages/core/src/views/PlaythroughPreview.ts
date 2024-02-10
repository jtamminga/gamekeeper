import { CoopPlaythrough, Playthrough, VsPlaythrough } from '@domains'
import { formatDate } from './utils'

type FormattedScore = { name: string, score: string }

export type FormattedPlaythrough = {
  id: string
  game?: string
  playedOn: string
  winner: string
  scores: FormattedScore[]
}


export function formatPlaythroughs(playthroughs: ReadonlyArray<Playthrough>, includeGameNames = false): ReadonlyArray<FormattedPlaythrough> {
  return playthroughs.map(playthrough => {
    const formatted: FormattedPlaythrough = {
      id: playthrough.id,
      playedOn: formatDate(playthrough.playedOn),
      winner: formatWinner(playthrough),
      scores: formatScores(playthrough)
    }

    if (includeGameNames) {
      formatted.game = playthrough.game.name
    }

    return formatted
  })
}

export function formatWinner(playthrough: Playthrough): string {
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

function formatScores(playthrough: Playthrough): FormattedScore[] {
  if (playthrough instanceof VsPlaythrough) {
    return playthrough.scores.all.map(score => ({
      name: score.player.name,
      score: score.value.toString()
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

