import { apiClient } from 'app/utils'


type GamePageProps = {
  params: { id: string }
}

export default async function GamePage({ params }: GamePageProps) {
  const gameData = await apiClient.getGame(params.id)

  return (
    <div>
      <h1>{gameData.name}</h1>

      {/* <Record gameData={gameData} /> */}
    </div>
  )
}