import { Loading, PlayerColor, PlaysByMonth, CalendarGraph, PlaythroughsList, StatCard } from '@app/components'
import { useView } from '@app/hooks'
import { StatsView } from '@gamekeeper/core'


export function Stats() {

  const { hydratedView } = useView(() => new StatsView())

  // render loading while waiting
  if (!hydratedView) {
    return <Loading />
  }

  const {
    daysSinceLastPlaythrough,
    numPlaysThisYear,
    winnerThisYear,
    numUniqueGamesPlayedThisYear,
    numPlaysByMonth,
    latestWinner,
    latestNumPlaythorughs,
    latestPlaythroughs,
    numPlaysPerDayThisYear
  } = hydratedView

  return (
    <>
      <h1>Stats</h1>
      <h2>{new Date().getFullYear()} stats</h2>

      <StatCard
        value={numPlaysThisYear}
        description="games played"
      />

      <StatCard
        value={winnerThisYear.winrate}
        description={<>best winrate <PlayerColor playerId={winnerThisYear.playerId}>{winnerThisYear.player}</PlayerColor></>}
      />

      <StatCard
        value={numUniqueGamesPlayedThisYear}
        description="unique games played"
      />

      <PlaysByMonth
        data={numPlaysByMonth}
      />

      <h2 className="mb-0">Recent stats</h2>
      <h3 className="mt-0 text-muted">for latest {latestNumPlaythorughs} games</h3>

      <StatCard
        value={latestWinner.winrate}
        description={<>winrate lately <PlayerColor playerId={latestWinner.playerId}>{latestWinner.player}</PlayerColor></>}
      />

      <StatCard
        value={daysSinceLastPlaythrough}
        description="days since last game"
      />

      <PlaythroughsList
        className="mt-lg"
        formattedPlaythroughs={latestPlaythroughs}
      />

      <h2>Plays per day</h2>

      <CalendarGraph
        countPerDay={numPlaysPerDayThisYear.plays}
        firstDay={numPlaysPerDayThisYear.firstDate}
      />
    </>
  )
}