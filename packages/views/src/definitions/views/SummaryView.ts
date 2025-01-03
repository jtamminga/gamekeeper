import { GameId, PlayerId } from '@gamekeeper/core'
import { FormattedGoal, FormattedPlaythroughs, FormattedWinrate } from '../models'


// types
export type BarChartData = {
  thisYear: number[]
  labels: string[]
}
export interface SummaryView {
  priorityGoal?: FormattedGoal
  numPlaysThisYear: number
  numPlaysAllTime: number
  numPlaysByMonth: BarChartData
  numUniqueGamesPlayedThisYear: number
  winnerThisYear?: {
    winrate: string
    player: string
    playerId: PlayerId
  }
  daysSinceLastPlaythrough: number
  latestPlaythroughs: FormattedPlaythroughs
  latestWinner?: {
    winrate: string
    player: string
    playerId: PlayerId
  }
  latestNumPlaythorughs: number
  numPlaysPerDayThisYear: {
    plays: number[]
    firstDate: Date
  }
  avgPlaysPerDayThisYear: string
  mostPlaysInDayThisYear: number,
  topPlayedGames: {
    gameName: string,
    gameId: GameId,
    numPlays: number,
    highestWinrate: FormattedWinrate | undefined
  }[]
}