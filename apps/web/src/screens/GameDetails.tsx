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
      <h1>Game details</h1>

      <span>{game.name}</span>

      {hydratedView &&
        <GameSummary
          view={hydratedView}
        />
      }
      
    </>
  )

}