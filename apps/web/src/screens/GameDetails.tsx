import { GameSummary, Link } from '@app/components'
import { useGamekeeper, useView } from '@app/hooks'
import { Game, GameId, GameView, VsGame } from '@gamekeeper/core'


type Props = {
  gameId: GameId
}


export function GameDetails({ gameId }: Props) {

  const { gameplay } = useGamekeeper()
  const game = gameplay.games.get(gameId)
  const { hydratedView } = useView(() => new GameView(game), [game])

  return (
    <>
      <div className="game-title-bar">
        <h1>{game.name}</h1>
        <Link page={{ name: 'EditGame', props: { gameId }}}>Edit</Link>
      </div>

      <div className="game-info-bar">
        {renderGameTypePill(game)}
        {game.weight !== undefined &&
          renderWeightPill(game.weight)
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

function renderGameTypePill(game: Game) {
  return (
    <div className="pill">
      {game instanceof VsGame
        ? 'VS'
        : 'Coop'
      }
    </div>
  )
}

function renderWeightPill(weight: number) {
  return (
    <div className="pill">
      Weight: {weight} / 5
    </div>
  )
}