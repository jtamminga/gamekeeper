import type { Game, PlayerId } from '@gamekeeper/core'
import type { FormattedPlaythroughs } from '../models'


interface FormattedStat {
  name: string
  valueAllTime: string,
  valueThisYear: string
}
interface FormattedPlayerStat extends FormattedStat {
  playerId: PlayerId
}
export type FormattedScoreStats = {
  average: string
  best: { score: string, player?: string, playerId?: PlayerId }
}
export interface GameView {
  readonly game: Game
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