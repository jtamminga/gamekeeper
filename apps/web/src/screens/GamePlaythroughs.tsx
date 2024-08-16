import { Link, PlaythroughsList } from '@app/components'
import { useGamekeeper, useView } from '@app/hooks'
import { AllPlaythroughsView, GameId } from '@gamekeeper/core'


type Props = {
  gameId: GameId
}


export function GamePlaythroughs({ gameId }: Props) {

  const gamekeeper = useGamekeeper()
  const game = gamekeeper.games.get(gameId)
  const { hydratedView } = useView(() => new AllPlaythroughsView(game), [game])

  return (
    <>
      <div className="game-title-bar">
        <h1>{game.name}</h1>
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