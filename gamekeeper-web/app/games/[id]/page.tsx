import { GameData, GameFactory } from 'gamekeeper-core'
import { GameApiResponse } from 'utils'
import Record from './record'

type GamePageProps = {
  params: { id: string }
}

async function getGame(id: string): Promise<GameData> {
  const response = await fetch(`http://localhost:3000/api/games?id=${id}`)
  const data = await response.json() as GameApiResponse
  return data.games[0]
}

export default async function GamePage({ params }: GamePageProps) {
  const gameData = await getGame(params.id)

  return (
    <div>
      <h1>{gameData.name}</h1>

      <Record gameData={gameData} />
    </div>
  )
}