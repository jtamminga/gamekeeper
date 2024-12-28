import { Link } from '@app/components'
import { useGamekeeper } from '@app/hooks'


export function Players() {
  const { gameplay } = useGamekeeper()

  return (
    <>
      <div className="title-with-link">
        <h1>Players</h1>
        <Link page={{ name: 'AddPlayer' }}>
          Add player
        </Link>
      </div>
      
      <div>
        {gameplay.players.all().map(player =>
          <Link
            key={player.id}
            page={{ name: 'EditPlayer', props: { playerId: player.id } }}
          >
            {player.name}
          </Link>
        )}
      </div>
    </>
  )
}