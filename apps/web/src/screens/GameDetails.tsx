import { GameSummary, Link } from '@app/components'
import { useView } from '@app/hooks'
import { GameId, GameView } from '@gamekeeper/core'


type Props = {
  gameId: GameId
}


export function GameDetails({ gameId }: Props) {

  const { view, hydratedView } = useView((gamekeeper) => new GameView(gamekeeper, gameId), [gameId])
  const game = view.game

  return (
    <>
      <div className="game-title-bar">
        <h1>{game.name}</h1>
        <Link page={{ name: 'EditGame', props: { gameId }}}>Edit</Link>
      </div>

      <div className="game-info-bar">
        <div className="pill">{view.typeLabel}</div>
        {view.weightLabel &&
          <div className="pill">{view.weightLabel}</div>
        }
      </div>

      {hydratedView &&
        <GameSummary
          view={hydratedView}
        />
      }
    </>
  )

}