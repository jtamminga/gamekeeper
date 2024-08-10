import { GameKeeper, StatsResult } from '@domains'
import { FormattedPlaythroughs, formatPlaythroughs } from './FormattedPlaythroughs'
import { addDays, differenceInDays, isBefore, isSameDay, startOfWeek } from 'date-fns'
import { HydratableView } from './HydratableView'
import { formatPercent } from './utils'
import { PlayerId, PlaysByDateDto } from '@services'


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
      numUniqueGamesPlayedThisYear,
      overallWinratesLatest,
      numPlaysPerDateThisYear,
    ] = await Promise.all([
      stats.numPlaythroughs({ year }),
      stats.numPlaythroughs({ year: year - 1 }),
      stats.numPlaythroughs({}),
      stats.playsByMonth({ year }),
      stats.overallWinrates({ year }),
      stats.uniqueGamesPlayed(year),
      stats.overallWinrates({ latestPlaythroughs: NUM_LATEST_PLAYTHROUGHTS }),
      stats.numPlaysByDate({ year }),
      gamekeeper.playthroughs.hydrate({ limit: NUM_LATEST_PLAYTHROUGHTS })
    ])

    const latestPlaythrough = gamekeeper.playthroughs.all()[0]
    const winningWinrate = overallWinratesThisYear.highest
    const winningLately = overallWinratesLatest.highest

    return {
      numUniqueGamesPlayedThisYear,
      numPlaysThisYear: totalPlays(numPlaysThisYear),
      numPlaysLastYear: totalPlays(numPlaysLastYear),
      numPlaysAllTime: totalPlays(numPlaysAllTime),
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
      latestWinner: {
        winrate: formatPercent(winningLately.winrate),
        player: winningLately.player.name,
        playerId: winningLately.player.id
      },
      latestNumPlaythorughs: NUM_LATEST_PLAYTHROUGHTS,
      latestPlaythroughs: formatPlaythroughs(gamekeeper.playthroughs.latest(NUM_LATEST_PLAYTHROUGHTS), { gameNames: true }),
      numPlaysPerDayThisYear: {
        ...toNumPlaysPerDay(numPlaysPerDateThisYear, year)
      }
    }
  }

}


// helpers
function totalPlays(grouped: StatsResult<number>): number {
  return Array.from(grouped.values()).reduce((sum, count) => sum + count)
}

function toNumPlaysPerDay(playsPerDate: PlaysByDateDto[], year: number): { plays: number[], firstDate: Date } {
  let curDay = new Date(year, 0)
  const firstDate = startOfWeek(curDay)
  curDay = firstDate

  let index = 0
  const today = Date.now()
  const result: number[] = []
  while(isBefore(curDay, today)) {
    if (isSameDay(curDay, playsPerDate[index]?.date)) {
      result.push(playsPerDate[index].plays)
      index++
    } else {
      result.push(0)
    }

    curDay = addDays(curDay, 1)
  }
  return {
    firstDate,
    plays: result
  }
}