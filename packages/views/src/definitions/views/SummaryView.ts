import { GameId, PlayerId } from '@gamekeeper/core'
import { FormattedGoal, FormattedPlaythroughs } from '../models'


// types
export type BarChartData = {
  thisYear: number[]
  labels: string[]
}
export interface SummaryView {
  readonly priorityGoal?: FormattedGoal
  readonly numPlaysThisYear: number
  readonly numPlaysLastYear: number
  readonly numPlaysAllTime: number
  readonly numPlaysByMonth: BarChartData
  readonly numUniqueGamesPlayedThisYear: number
  readonly winnerThisYear: {
    winrate: string
    player: string
    playerId: PlayerId
  }
  readonly daysSinceLastPlaythrough: number
  readonly latestPlaythroughs: FormattedPlaythroughs
  readonly latestWinner: {
    winrate: string
    player: string
    playerId: PlayerId
  }
  readonly latestNumPlaythorughs: number
  readonly numPlaysPerDayThisYear: {
    plays: number[]
    firstDate: Date
  }
  readonly avgPlaysPerDayThisYear: string
  readonly mostPlaysInDayThisYear: number,
  readonly topPlayedGames: {
    gameName: string,
    gameId: GameId,
    numPlays: number,
    highestWinrate: {
      playerId: PlayerId
      playerName: string
      percentage: string
    } | undefined
  }[]
}