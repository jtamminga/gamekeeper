import Link from 'next/link'
import { gamekeeper } from 'utils'


// page 
export default async function GamesPage() {
  const games = await gamekeeper.games.all()

  return (
    <div>
      {games.map(game =>
        <Link href={`/games/${game.id}`}>
          <div key={game.id}>{game.name}</div>
        </Link>
      )}
    </div>
  )
}