import { Link } from '@app/components'
import { useGamekeeper } from '@app/hooks'
import { backToSetup } from './callbackProps'


export function PlayerSetup() {
  const { gameplay } = useGamekeeper()
  const players = gameplay.players.all()
  
  return (
    <div className="mb-lg">
      <div className="title-with-link">
        <h2>Players</h2>
        <Link page={{ name: 'AddPlayer', props: backToSetup }}>Add player</Link>
      </div>
      {players.length === 0 &&
        <div>
          Add you and others that play games
        </div>
      }
      {players.length > 0 &&
        <div className="link-list">
          {players.map(player =>
            <Link key={player.id} page={{ name: 'EditPlayer', props: { playerId: player.id, ...backToSetup }}}>
              {player.name}
            </Link>
          )}
        </div>
      }
    </div>
  )
  
}