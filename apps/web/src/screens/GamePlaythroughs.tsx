import { PlaythroughsList } from '@app/components'
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
      <h1>All Playthroughs</h1>

      <h2>{game.name}</h2>

      {hydratedView &&
        <PlaythroughsList
          formattedPlaythroughs={hydratedView.playthroughs}
        />
      }
    </>
  )
}