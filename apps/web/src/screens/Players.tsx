import { Link, PlayerColor } from '@app/components'
import { useGamekeeper } from '@app/hooks'


export function Players() {
  const { gameplay } = useGamekeeper()
  const players = gameplay.players.all()

  return (
    <>
      <div className="title-with-link">
        <h1>Players</h1>
        <Link page={{ name: 'AddPlayer' }}>
          Add player
        </Link>
      </div>

      {players.length === 0 &&
        <div className="empty">
          Add you and your mates
        </div>
      }
      
      {players.length > 0 &&
        <div className="link-list">
          {players.map(player =>
            <Link
              key={player.id}
              page={{ name: 'EditPlayer', props: { playerId: player.id } }}
            >
              <PlayerColor playerId={player.id}>
                {player.name}
              </PlayerColor>
            </Link>
          )}
        </div>
      }
    </>
  )
}