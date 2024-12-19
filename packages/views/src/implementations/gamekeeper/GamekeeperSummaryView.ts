import { SummaryView } from '@def/views'
import { HydratableView } from './HydratableView'
import { ArrayUtils, GameKeeper, StatsResult } from '@gamekeeper/core'
import { toNumPlaysPerDay } from '../transforms'
import { differenceInDays } from 'date-fns'
import { formatNumber, formatPercent, formatPlaythroughs } from '../formatters'


const NUM_LATEST_PLAYTHROUGHTS = 10


export class GamekeeperSummaryView implements HydratableView<SummaryView> {
  public constructor(private readonly gamekeeper: GameKeeper) { }

  public async hydrate(): Promise<SummaryView> {
    const {stats} = this.gamekeeper.insights
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
      this.gamekeeper.gameplay.playthroughs.hydrate({ limit: NUM_LATEST_PLAYTHROUGHTS })
    ])

    const latestPlaythrough = this.gamekeeper.gameplay.playthroughs.all()[0]
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
      latestPlaythroughs: formatPlaythroughs(this.gamekeeper.gameplay.playthroughs.latest(NUM_LATEST_PLAYTHROUGHTS), { gameNames: true }),
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