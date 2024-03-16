import { GameKeeper, StatsResult, Winrate } from '@domains'
import { FormattedPlaythrough, formatPlaythroughs } from './PlaythroughPreview'
import { differenceInDays } from 'date-fns'
import { HydratableView } from './HydratableView'
import { formatPercent } from './utils'


// types
export type BarChartData = {
  thisYear: number[]
  labels: string[]
}
export interface HydratedStatsView {
  readonly numPlaysThisYear: number
  readonly numPlaysLastYear: number
  readonly numPlaysAllTime: number
  readonly numPlaysByMonth: BarChartData
  readonly latestPlaythroughs: ReadonlyArray<FormattedPlaythrough>
  readonly daysSinceLastPlaythrough: number
  readonly winnerThisYear: {
    winrate: string
    player: string
  }
  readonly numUniqueGamesPlayed: number
}


// constants
const NUM_LATEST_PLAYTHROUGHTS = 10


export class StatsView implements HydratableView<HydratedStatsView> {
  
  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedStatsView> {
    const {stats} = gamekeeper
    const year = new Date().getFullYear()

    const [
      numPlaysThisYear,
      numPlaysLastYear,
      numPlaysAllTime,
      numPlaysByMonthThisYear,
      overallWinrates,
      numUniqueGamesPlayed
    ] = await Promise.all([
      stats.numPlaythroughs({ year }),
      stats.numPlaythroughs({ year: year - 1 }),
      stats.numPlaythroughs({}),
      stats.playsByMonth({ year }),
      stats.overallWinrates(year),
      stats.uniqueGamesPlayed(year),
      gamekeeper.playthroughs.hydrate({ limit: NUM_LATEST_PLAYTHROUGHTS })
    ])

    const latestPlaythrough = gamekeeper.playthroughs.all()[0]
    const winningWinrate = overallWinrates.highest

    return {
      numPlaysThisYear: totalPlays(numPlaysThisYear),
      numPlaysLastYear: totalPlays(numPlaysLastYear),
      numPlaysAllTime: totalPlays(numPlaysAllTime),
      latestPlaythroughs: formatPlaythroughs(gamekeeper.playthroughs.latest(NUM_LATEST_PLAYTHROUGHTS), true),
      daysSinceLastPlaythrough: latestPlaythrough
        ? differenceInDays(Date.now(), latestPlaythrough.playedOn)
        : -1,
      numPlaysByMonth: {
        thisYear: numPlaysByMonthThisYear,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      winnerThisYear: {
        winrate: formatPercent(winningWinrate.winrate),
        player: winningWinrate.player.name
      },
      numUniqueGamesPlayed
    }
  }

}


// helpers
function totalPlays(grouped: StatsResult<number>): number {
  return Array.from(grouped.values()).reduce((sum, count) => sum + count)
}