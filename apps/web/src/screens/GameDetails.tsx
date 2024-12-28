import { GameSummary, Link, Loading } from '@app/components'
import { useGameView } from '@app/hooks'
import type { GameId } from '@gamekeeper/core'


type Props = {
  gameId: GameId
}


export function GameDetails({ gameId }: Props) {
  const view = useGameView(gameId)
  if (!view) {
    return <Loading />
  }

  return (
    <>
      <div className="title-with-link">
        <h1>{view.game.name}</h1>
        <Link page={{ name: 'EditGame', props: { gameId }}}>Edit</Link>
      </div>

      <div className="game-info-bar">
        <div className="pill">{view.gameTypeLabel}</div>
        {view.weightLabel &&
          <div className="pill">{view.weightLabel}</div>
        }
      </div>

      <GameSummary
        view={view}
      />
    </>
  )

}