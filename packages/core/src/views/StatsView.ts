import { GameKeeper } from '@domains'
import { FormattedPlaythroughs, formatPlaythroughs } from './FormattedPlaythroughs'
import { differenceInDays } from 'date-fns'
import { HydratableView } from './HydratableView'
import { formatNumber, formatPercent, toNumPlaysPerDay } from './utils'
import { GameId, PlayerId } from '@services'
import { ArrayUtils } from '@core'
import { StatsResult } from '@domains/insights'


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


// constants
const NUM_LATEST_PLAYTHROUGHTS = 10


export class StatsView implements HydratableView<HydratedStatsView> {
  
  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedStatsView> {
    const {stats} = gamekeeper.insights
    const year = new Date().getFullYear()

    const [
      numPlaysThisYear,
      numPlaysLastYear,
      numPlaysAllTime,
      numPlaysByMonthThisYear,
      overallWinratesThisYear,
      numUniqueGamesPlayedThisYear,
      overallWinratesLatest,
      numPlaysByDateThisYear,
      winratesThisYear,
    ] = await Promise.all([
      stats.numPlaythroughs({ year }),
      stats.numPlaythroughs({ year: year - 1 }),
      stats.numPlaythroughs({}),
      stats.playsByMonth({ year }),
      stats.overallWinrates({ year }),
      stats.uniqueGamesPlayed(year),
      stats.overallWinrates({ latestPlaythroughs: NUM_LATEST_PLAYTHROUGHTS }),
      stats.numPlaysByDate({ year }),
      stats.winrates({ year }),
      gamekeeper.gameplay.playthroughs.hydrate({ limit: NUM_LATEST_PLAYTHROUGHTS })
    ])

    const latestPlaythrough = gamekeeper.gameplay.playthroughs.all()[0]
    const winningWinrate = overallWinratesThisYear.highest
    const winningLately = overallWinratesLatest.highest

    const topPlayedGames = [...numPlaysThisYear.entries()]
      .map(([game, numPlays]) => {
        const highestWinrate = winratesThisYear.get(game)?.highest
        return {
          gameId: game.id,
          gameName: game.name,
          numPlays,
          highestWinrate: highestWinrate
            ? {
                playerId: highestWinrate.player.id,
                playerName: highestWinrate.player.name,
                percentage: formatPercent(highestWinrate.winrate)
              }
            : undefined
        }
      })
      .sort((a, b) => b.numPlays - a.numPlays)
      .slice(0, 5)

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
      latestPlaythroughs: formatPlaythroughs(gamekeeper.gameplay.playthroughs.latest(NUM_LATEST_PLAYTHROUGHTS), { gameNames: true }),
      numPlaysPerDayThisYear: {
        ...toNumPlaysPerDay(numPlaysByDateThisYear, year)
      },
      avgPlaysPerDayThisYear: formatNumber(ArrayUtils.average(numPlaysByDateThisYear.map(i => i.plays))),
      mostPlaysInDayThisYear: numPlaysByDateThisYear.reduce((most, cur) => cur.plays > most ? cur.plays : most, 0),
      topPlayedGames
    }
  }

}


// helpers
function totalPlays(grouped: StatsResult<number>): number {
  return Array.from(grouped.values()).reduce((sum, count) => sum + count)
}