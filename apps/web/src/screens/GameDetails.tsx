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
      <div className="title-with-link for-game">
        <h1>{view.name}</h1>
        <Link page={{ name: 'EditGame', props: { gameId }}}>Edit</Link>
      </div>

      <div className="flex flex-wrap gap-md mb-lg">
        <div className="pill">{view.type}</div>
        {view.weight &&
          <div className="pill">{view.weight}</div>
        }
        {view.own &&
          <div className="pill">Own</div>
        }
      </div>

      <GameSummary
        view={view}
      />
    </>
  )

}