import { GameSummary, GameWeight, Link } from '@app/components'
import { useGamekeeper, useView } from '@app/hooks'
import { GameId, GameView } from '@gamekeeper/core'


type Props = {
  gameId: GameId
}


export function GameDetails({ gameId }: Props) {

  const gamekeeper = useGamekeeper()
  const game = gamekeeper.games.get(gameId)
  const { hydratedView } = useView(() => new GameView(game), [game])

  return (
    <>
      <div className="flex v-centered">
        {game.weight !== undefined &&
          <GameWeight weight={game.weight} />
        }
        <h1 className="grow">{game.name}</h1>
        <Link page={{ name: 'EditGame', props: { gameId }}}>Edit</Link>
      </div>


      {hydratedView &&
        <GameSummary
          view={hydratedView}
        />
      }
      
    </>
  )

}