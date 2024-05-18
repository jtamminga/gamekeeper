import { Loading, PlayerColor, PlaysByMonth, PlaythroughsList, StatCard } from '@app/components'
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
    latestPlaythroughs,
    winnerLately
  } = hydratedView

  return (
    <>
      <h1>Stats</h1>

      <StatCard
        value={daysSinceLastPlaythrough}
        description="days since last game"
      />

      <StatCard
        value={winnerLately.winrate}
        description={<>winner of last 10 games <PlayerColor playerId={winnerLately.playerId}>{winnerLately.player}</PlayerColor></>}
      />

      <h2>{new Date().getFullYear()} stats</h2>

      <StatCard
        value={numPlaysThisYear}
        description="games played"
      />

      <StatCard
        value={winnerThisYear.winrate}
        description={<>winner <PlayerColor playerId={winnerThisYear.playerId}>{winnerThisYear.player}</PlayerColor></>}
      />

      <StatCard
        value={numUniqueGamesPlayed}
        description="unique games played"
      />

      <PlaysByMonth
        data={numPlaysByMonth}
      />

      <PlaythroughsList
        formattedPlaythroughs={latestPlaythroughs}
      />
    </>
  )
}