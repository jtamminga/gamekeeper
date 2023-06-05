import { GameId } from 'gamekeeper-core'
import { gamekeeper } from 'utils'


type GamePageProps = {
  params: { id: GameId }
}


// page
export default async function GamePage({ params }: GamePageProps) {
  const game = await gamekeeper.games.get(params.id)

  return (
    <div>
      <h1>{game.name}</h1>

      {/* <Record gameData={gameData} /> */}
    </div>
  )
}


// static params
export async function generateStaticParams() {
  const games = await gamekeeper.games.all()

  return games.map(game => ({
    id: game.id
  }))
}