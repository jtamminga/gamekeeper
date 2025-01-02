import type { Game } from '@gamekeeper/core'
import type { FormattedPlayerStat, FormattedPlaythroughs, FormattedScoreStats, FormattedStat } from '../models'


export interface GameView {
  game: Game
  gameTypeLabel: string
  weightLabel: string | undefined
  numPlaythroughs: FormattedStat
  winrates: ReadonlyArray<FormattedPlayerStat>
  stats: ReadonlyArray<FormattedStat>
  scoreStats: FormattedScoreStats | undefined
  latestPlaythroughs: FormattedPlaythroughs
  hasMorePlaythroughs: boolean
  numPlaysPerDayThisYear: {
    plays: number[]
    firstDate: Date
  }
}