import { Loading, PlaysByMonth, PlaythroughsList } from '@app/components'
import { useView } from '@app/hooks'
import { StatsView } from '@gamekeeper/core'


export function Stats() {

  const {hydratedView} = useView(() => new StatsView())

  // render loading while waiting
  if (!hydratedView) {
    return <Loading />
  }

  return (
    <>
      <h1>Stats</h1>

      <h2>{hydratedView.daysSinceLastPlaythrough} days since last game</h2>

      <h3>{hydratedView.numPlaysThisYear} games played this year</h3>

      <PlaysByMonth
        data={hydratedView.numPlaysByMonth}
      />

      <PlaythroughsList
        playthroughs={hydratedView.latestPlaythroughs}
        hideScores
      />
    </>
  )
}