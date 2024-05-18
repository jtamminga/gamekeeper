import { GameKeeper, StatsResult } from '@domains'
import { FormattedPlaythroughs, formatPlaythroughs } from './FormattedPlaythroughs'
import { differenceInDays } from 'date-fns'
import { HydratableView } from './HydratableView'
import { formatPercent } from './utils'
import { PlayerId } from '@services'


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
  readonly latestPlaythroughs: FormattedPlaythroughs
  readonly daysSinceLastPlaythrough: number
  readonly winnerThisYear: {
    winrate: string
    player: string
    playerId: PlayerId
  }
  readonly winnerLately: {
    winrate: string
    player: string
    playerId: PlayerId
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
      overallWinratesThisYear,
      numUniqueGamesPlayed,
      overallWinratesLatest,
    ] = await Promise.all([
      stats.numPlaythroughs({ year }),
      stats.numPlaythroughs({ year: year - 1 }),
      stats.numPlaythroughs({}),
      stats.playsByMonth({ year }),
      stats.overallWinrates({ year }),
      stats.uniqueGamesPlayed(year),
      stats.overallWinrates({ latestPlaythroughs: NUM_LATEST_PLAYTHROUGHTS }),
      gamekeeper.playthroughs.hydrate({ limit: NUM_LATEST_PLAYTHROUGHTS })
    ])

    const latestPlaythrough = gamekeeper.playthroughs.all()[0]
    const winningWinrate = overallWinratesThisYear.highest
    const winningLately = overallWinratesLatest.highest

    return {
      numPlaysThisYear: totalPlays(numPlaysThisYear),
      numPlaysLastYear: totalPlays(numPlaysLastYear),
      numPlaysAllTime: totalPlays(numPlaysAllTime),
      latestPlaythroughs: formatPlaythroughs(gamekeeper.playthroughs.latest(NUM_LATEST_PLAYTHROUGHTS), { gameNames: true }),
      daysSinceLastPlaythrough: latestPlaythrough
        ? differenceInDays(Date.now(), latestPlaythrough.playedOn)
        : -1,
      numPlaysByMonth: {
        thisYear: numPlaysByMonthThisYear,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      winnerThisYear: {
        winrate: formatPercent(winningWinrate.winrate),
        player: winningWinrate.player.name,
        playerId: winningWinrate.player.id
      },
      winnerLately: {
        winrate: formatPercent(winningLately.winrate),
        player: winningLately.player.name,
        playerId: winningLately.player.id
      },
      numUniqueGamesPlayed
    }
  }

}


// helpers
function totalPlays(grouped: StatsResult<number>): number {
  return Array.from(grouped.values()).reduce((sum, count) => sum + count)
}