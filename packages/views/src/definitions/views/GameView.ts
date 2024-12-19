import type { Game } from '@gamekeeper/core'
import type { FormattedPlayerStat, FormattedPlaythroughs, FormattedScoreStats, FormattedStat } from '../models'


export interface GameView {
  readonly game: Game
  readonly gameTypeLabel: string
  readonly weightLabel: string | undefined
  readonly numPlaythroughs: FormattedStat
  readonly winrates: ReadonlyArray<FormattedPlayerStat>
  readonly stats: ReadonlyArray<FormattedStat>
  readonly scoreStats: FormattedScoreStats | undefined
  readonly latestPlaythroughs: FormattedPlaythroughs
  readonly hasMorePlaythroughs: boolean
  readonly numPlaysPerDayThisYear: {
    plays: number[]
    firstDate: Date
  }
}