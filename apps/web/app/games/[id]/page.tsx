import { GameId } from 'gamekeeper-core'
import { gamekeeper } from 'utils'


type GamePageProps = {
  params: { id: GameId }
}


// page
export default async function GamePage({ params }: GamePageProps) {
  await gamekeeper.hydrate()
  const game = gamekeeper.games.get(params.id)

  return (
    <div>
      <h1>{game.name}</h1>

      {/* <Record gameData={gameData} /> */}
    </div>
  )
}