import { SummaryView } from '@def/views'
import { ArrayUtils, GameKeeper, StatsResult } from '@gamekeeper/core'
import { toNumPlaysPerDay } from '../transforms'
import { differenceInDays } from 'date-fns'
import { formatDate, formatGoal, formatNumber, formatPercent, formatPlaythroughs, formatWinrate } from '../formatters'


const NUM_LATEST_PLAYTHROUGHTS = 10


export class SummaryViewFactory {
  public constructor(private readonly gamekeeper: GameKeeper) { }

  public async create(year?: number): Promise<SummaryView> {
    const { stats } = this.gamekeeper.insights
    const currentYear = new Date().getFullYear()
    year = year ?? currentYear

    const [
      numPlaysThisYear,
      numPlaysAllTime,
      numPlaysByMonthThisYear,
      overallWinratesThisYear,
      numUniqueGamesPlayedThisYear,
      overallWinratesLatest,
      numPlaysByDateThisYear,
      winratesThisYear,
      playStreakThisYear
    ] = await Promise.all([
      stats.numPlaythroughs({ year }),
      stats.numPlaythroughs({}),
      stats.playsByMonth({ year }),
      stats.overallWinrates({ year }),
      stats.uniqueGamesPlayed(year),
      stats.overallWinrates({ latestPlaythroughs: NUM_LATEST_PLAYTHROUGHTS }),
      stats.numPlaysByDate({ year }),
      stats.winrates({ year }),
      stats.playStreak({ year }),
      // hydration requirements
      this.gamekeeper.gameplay.playthroughs.hydrate({ limit: NUM_LATEST_PLAYTHROUGHTS }),
      this.gamekeeper.insights.goals.hydrate({ year })
    ])

    const goals = this.gamekeeper.insights.goals.all({ year })
    if (goals.length > 0) {
      await Promise.all(goals.map(goal => goal.load()))
    }
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
            ? formatWinrate(highestWinrate, game)
            : undefined
        }
      })
      .sort((a, b) => b.numPlays - a.numPlays)
      .slice(0, 5)

    const view: SummaryView = {
      year,
      currentYear,
      isCurrentYear: year === currentYear,
      isPastYear: year < currentYear,
      goals: goals.map(formatGoal),
      numUniqueGamesPlayedThisYear,
      numPlaysThisYear: totalPlays(numPlaysThisYear),
      numPlaysAllTime: totalPlays(numPlaysAllTime),
      daysSinceLastPlaythrough: latestPlaythrough
        ? differenceInDays(Date.now(), latestPlaythrough.playedOn)
        : -1,
      numPlaysByMonth: {
        thisYear: numPlaysByMonthThisYear,
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      playStreakThisYear: {
        bestStreak: playStreakThisYear.bestStreak,
        bestStartDate: playStreakThisYear.bestStart
          ? formatDate(playStreakThisYear.bestStart)
          : undefined,
        currentStreak: playStreakThisYear.currentStreak
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

    if (winningWinrate) {
      view.winnerThisYear = {
        winrate: formatPercent(winningWinrate.winrate),
        player: winningWinrate.player.name,
        playerId: winningWinrate.player.id
      }
    }
    if (winningLately) {
      view.latestWinner = {
        winrate: formatPercent(winningLately.winrate),
        player: winningLately.player.name,
        playerId: winningLately.player.id
      }
    }

    return view
  }
}


// helpers
function totalPlays(grouped: StatsResult<number>): number {
  return Array.from(grouped.values()).reduce((sum, count) => sum + count, 0)
}