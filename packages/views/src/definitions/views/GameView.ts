import type { Game } from '@gamekeeper/core'
import type { FormattedPlayerStat, FormattedPlaythroughs, FormattedScoreStats, FormattedStat, FormattedWinrate } from '../models'


export interface GameView {
  year: number
  game: Game
  gameTypeLabel: string
  weightLabel: string | undefined
  numPlaythroughs: FormattedStat
  winnerAllTime: FormattedWinrate | undefined
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