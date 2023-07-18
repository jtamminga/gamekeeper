import Link from 'next/link'
import { gamekeeper } from 'utils'


// page 
export default async function GamesPage() {
  await gamekeeper.games.hydrate()

  const games = gamekeeper.games.all()

  return (
    <div>
      {games.map(game =>
        <Link key={game.id} href={`/games/${game.id}`}>
          {game.name}
        </Link>
      )}
    </div>
  )
}