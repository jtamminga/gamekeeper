import { GameSummary } from '@app/components'
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
      <h1>{game.name}</h1>

      {hydratedView &&
        <GameSummary
          view={hydratedView}
        />
      }
      
    </>
  )

}