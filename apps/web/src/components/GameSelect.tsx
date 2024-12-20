import { GameId } from '@gamekeeper/core'
import { useGamekeeper } from '../hooks'


type Props = {
  gameId: GameId | undefined
  onChange: (id: GameId) => void
}


export function GameSelect({ gameId, onChange }: Props) {

  const { gameplay } = useGamekeeper()
  const games = gameplay.games.all()

  return (
    <div className="form-control">
      <label>Game played</label>
      <select
        value={gameId ?? ''}
        onChange={e => onChange(e.target.value as GameId)}
      >
        <option value="" disabled>select game</option>
        {games.map(game =>
          <option key={game.id} value={game.id}>{game.name}</option>
        )}
      </select>
    </div>
  )
}