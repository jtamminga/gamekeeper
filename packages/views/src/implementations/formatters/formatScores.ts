import { CoopPlaythrough, Playthrough, VsPlaythrough } from '@gamekeeper/core'
import { FormattedScore } from '@def/models'

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