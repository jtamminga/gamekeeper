import { Loading, PlaythroughsList } from '@app/components'
import { useGamekeeper } from '@app/hooks'
import { HydratedStatsView, StatsView } from '@gamekeeper/core'
import { useEffect, useState } from 'react'

export function Stats() {

  const gamekeeper = useGamekeeper()
  const [view, setView] = useState<HydratedStatsView>()

  // fetch data
  useEffect(() => {
    async function fetchData() {
      const view = await new StatsView().hydrate(gamekeeper)
      setView(view)
    }
    fetchData()
  }, [gamekeeper])

  // render loading while waiting
  if (!view) {
    return <Loading />
  }

  return (
    <>
      <h1>Stats</h1>

      <h2>{view.daysSinceLastPlaythrough} days since last game</h2>

      <h3>{view.numPlaysThisYear} games played this year</h3>

      <PlaythroughsList playthroughs={view.latestPlaythroughs} />
    </>
  )
}