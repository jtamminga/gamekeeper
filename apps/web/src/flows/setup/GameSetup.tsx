import { Link } from '@app/components'
import { useGamekeeper } from '@app/hooks'
import { backToSetup } from './callbackProps'


export function GameSetup() {
  const { gameplay } = useGamekeeper()
  const games = gameplay.games.all()
  
  return (
    <div className="mb-lg">
      <div className="title-with-link">
        <h2>Games</h2>
        <Link page={{ name: 'AddGame', props: backToSetup }}>Add game</Link>
      </div>
      {games.length === 0 &&
        <div className="empty">
          Add some games from your collection      
        </div>
      }
      {games.length > 0 &&
        <div className="link-list">
          {games.map(game =>
            <Link key={game.id} page={{ name: 'EditGame', props: { gameId: game.id, ...backToSetup }}}>
              {game.name}
            </Link>
          )}
        </div>
      }
    </div>
  )
  
}