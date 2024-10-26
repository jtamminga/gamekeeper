import { PlaythroughsList } from '@app/components'
import { useView } from '@app/hooks'
import { PlaythroughQueryOptions, PlaythroughsView } from '@gamekeeper/core'


type Props = PlaythroughQueryOptions & { desc?: string }


export function Playthroughs({ gameId, fromDate, toDate, desc = 'All playthroughs' }: Props) {

  const { hydratedView } = useView((gameKeeper) =>
    new PlaythroughsView(gameKeeper, { gameId, fromDate, toDate }), [gameId, fromDate, toDate]
  )

  return (
    <>
      <div className="game-title-bar">
        <h1>Playthroughs</h1>
      </div>

      <h3>{desc}</h3>
      {hydratedView &&
        <PlaythroughsList
          formattedPlaythroughs={hydratedView.playthroughs}
        />
      }
    </>
  )
}