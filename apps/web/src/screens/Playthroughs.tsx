import { Loading, PlaythroughsList } from '@app/components'
import { usePlaythroughsView } from '@app/hooks'
import { PlaythroughQueryOptions } from '@gamekeeper/core'


type Props = PlaythroughQueryOptions & { desc?: string }


export function Playthroughs({ gameId, fromDate, toDate, desc = 'All playthroughs' }: Props) {

  const view = usePlaythroughsView({ gameId, fromDate, toDate }, { gameNames: true })
  if (!view) {
    return <Loading />
  }

  return (
    <>
      <div className="title-with-link">
        <h1>Playthroughs</h1>
      </div>

      <h3>{desc}</h3>
      <PlaythroughsList
        formattedPlaythroughs={view.playthroughs}
      />
    </>
  )
}