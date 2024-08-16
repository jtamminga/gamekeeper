import { CalendarGraph, Loading, PlayerColor, PlaysByMonth, PlaythroughsList, StatCard } from '@app/components'
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
    numPlaysPerDayThisYear,
    avgPlaysPerDayThisYear,
    mostPlaysInDayThisYear
  } = hydratedView

  const curYear = new Date().getFullYear()

  return (
    <>
      <h1 className="mt-0 mb-0">Stats</h1>

      <div className="page-subtitle">
        <h2>Overall</h2>
        <h3>{curYear}</h3>
      </div>

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

      <div className="page-subtitle">
        <h2>Recent stats</h2>
        <h3>latest {latestNumPlaythorughs} games</h3>
      </div>

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

      <div className="page-subtitle">
        <h2>Plays per day</h2>
        <h3>{curYear}</h3>
      </div>

      <div className="mb-lg">
        <StatCard
          value={avgPlaysPerDayThisYear}
          description="Average plays per day"
        />

        <StatCard
          value={mostPlaysInDayThisYear}
          description="Most plays in one day"
        />
      </div>

      <CalendarGraph
        countPerDay={numPlaysPerDayThisYear.plays}
        firstDay={numPlaysPerDayThisYear.firstDate}
      />
    </>
  )
}