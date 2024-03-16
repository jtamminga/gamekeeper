import { Loading, PlaysByMonth, PlaythroughsList, StatCard } from '@app/components'
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
    numUniqueGamesPlayed,
    numPlaysByMonth,
    latestPlaythroughs
  } = hydratedView

  return (
    <>
      <h1>Stats</h1>

      <StatCard
        value={daysSinceLastPlaythrough}
        description="days since last game"
      />

      <StatCard
        value={numPlaysThisYear}
        description="games played"
      />

      <StatCard
        value={winnerThisYear.winrate}
        description={`winner ${winnerThisYear.player}`}
      />

      <StatCard
        value={numUniqueGamesPlayed}
        description="unique games played"
      />

      <PlaysByMonth
        data={numPlaysByMonth}
      />

      <PlaythroughsList
        playthroughs={latestPlaythroughs}
        hideScores
      />
    </>
  )
}