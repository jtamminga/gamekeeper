import { GameId } from '@gamekeeper/core'
import { useGamekeeper } from '../hooks'


type Props = {
  gameId: GameId | undefined
  onChange: (id: GameId) => void
}


export function GameSelect({ gameId, onChange }: Props) {

  const gamekeeper = useGamekeeper()
  const games = gamekeeper.games.all()

  return (
    <select
      value={gameId ?? ''}
      onChange={e => onChange(e.target.value as GameId)}
    >
      <option value="" disabled>select game</option>
      {games.map(game =>
        <option key={game.id} value={game.id}>{game.name}</option>
      )}
    </select>
  )
}