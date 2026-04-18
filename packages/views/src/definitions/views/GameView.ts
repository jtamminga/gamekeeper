import type { GameId } from '@gamekeeper/core'
import type { FormattedPlayerStat, FormattedPlaysPerDay, FormattedPlaythroughs, FormattedScoreStats, FormattedStat, FormattedWinrate, ISODate } from '../models'


export interface GameView {
  year: number
  name: string
  id: GameId
  type: string
  weight: string | undefined
  own: boolean
  numPlaythroughs: FormattedStat
  winnerAllTime: FormattedWinrate | undefined
  winrates: ReadonlyArray<FormattedPlayerStat>
  stats: ReadonlyArray<FormattedStat>
  scoreStats: FormattedScoreStats | undefined
  latestPlaythroughs: FormattedPlaythroughs
  hasMorePlaythroughs: boolean
  numPlaysPerDayThisYear: FormattedPlaysPerDay
}