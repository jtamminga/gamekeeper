import { CoopPlaythrough, Playthrough, VsPlaythrough } from '@domains'
import { formatDate, toWinnerName } from './utils'
import type { GameId, PlayerId, PlaythroughId } from '@services'


export type FormattedScore = { name: string, score: string, playerId?: PlayerId }
export type FormattedPlaythrough = {
  id: PlaythroughId
  gameId: GameId
  playedOn: string
  winner: string
  game?: string
  winnerId?: PlayerId
  scores?: FormattedScore[]
}
export type FormatPlaythroughOptions = {
  gameNames?: boolean
  scores?: boolean
}
export type FormattedPlaythroughs = {
  readonly playthroughs: ReadonlyArray<FormattedPlaythrough>
  readonly options: Readonly<Required<FormatPlaythroughOptions>>
}


export function formatPlaythroughs(
  playthroughs: ReadonlyArray<Playthrough>,
  options?: FormatPlaythroughOptions
): FormattedPlaythroughs {
  const formattedPlaythroughs = playthroughs.map(playthrough => {
    const formatted: FormattedPlaythrough = {
      id: playthrough.id,
      gameId: playthrough.gameId,
      playedOn: formatDate(playthrough.playedOn),
      winner: toWinnerName(playthrough),
      winnerId: toWinnerId(playthrough),
    }

    if (options?.gameNames) {
      formatted.game = playthrough.game.name
    }
    if (options?.scores) {
      formatted.scores = formatScores(playthrough)
    }

    return formatted
  })

  return {
    playthroughs: formattedPlaythroughs,
    options: {
      gameNames: false,
      scores: false,
      ...options
    }
  }
}

function toWinnerId(playthrough: Playthrough): PlayerId | undefined {
  return playthrough instanceof VsPlaythrough
    ? playthrough.winnerId ?? undefined
    : undefined
}

export function formatScores(playthrough: Playthrough): FormattedScore[] {
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

