import { Link, PlaythroughsList } from '@app/components'
import { useView } from '@app/hooks'
import { GameId, PlaythroughsView } from '@gamekeeper/core'


type Props = {
  gameId: GameId
}


export function GamePlaythroughs({ gameId }: Props) {

  const { view, hydratedView } = useView((gamekeeper) =>
    new PlaythroughsView(gamekeeper, { gameId }), [gameId]
  )

  return (
    <>
      <div className="game-title-bar">
        <h1>{view.game!.name}</h1>
        <Link page={{ name: 'GameDetails', props: { gameId }}}>Back</Link>
      </div>

      <h3>All Playthroughs</h3>
      {hydratedView &&
        <PlaythroughsList
          formattedPlaythroughs={hydratedView.playthroughs}
        />
      }
    </>
  )
}