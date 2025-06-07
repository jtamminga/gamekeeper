import { Link, Loading, PlaythroughsList } from '@app/components'
import { usePlaythroughsView } from '@app/hooks'
import { GameId } from '@gamekeeper/core'


type Props = {
  gameId: GameId
}


export function GamePlaythroughs({ gameId }: Props) {

  const view = usePlaythroughsView({ gameId }, { scores: true })
  if (!view) {
    return <Loading />
  }

  return (
    <>
      <div className="title-with-link">
        <h1>{view.game!.name}</h1>
        <Link page={{ name: 'GameDetails', props: { gameId }}}>Back</Link>
      </div>

      <h3>All Playthroughs</h3>
      <PlaythroughsList
        formattedPlaythroughs={view.playthroughs}
      />
    </>
  )
}