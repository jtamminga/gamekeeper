import { apiClient } from 'app/utils'


// page 
export default async function GamesPage() {
  const games = await apiClient.getGames()

  return (
    <div>
      {games.map(game =>
        <div key={game.id}>{game.name}</div>
      )}
    </div>
  )
}