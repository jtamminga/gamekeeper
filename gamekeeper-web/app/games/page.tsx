import { Game, GameData, GameFactory } from 'gamekeeper-core'
import { GameApiResponse } from 'utils'

// fetch games
async function getGames(): Promise<ReadonlyArray<GameData>> {
  const request = await fetch('http://localhost:3000/api/games')
  const data = await request.json() as GameApiResponse

  return data.games
}


// page 
export default async function GamesPage() {
  const games = await getGames()

  return (
    <div>
      {games.map(game =>
        <div>{game.name}</div>
      )}
    </div>
  )
}