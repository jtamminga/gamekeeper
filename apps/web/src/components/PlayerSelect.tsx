import { PlayerId } from '@gamekeeper/core'
import { useGamekeeper } from '../hooks'


type Props = {
  playerIds: ReadonlyArray<PlayerId>
  onChange: (ids: PlayerId[]) => void
}


export function PlayerSelect({ playerIds, onChange }: Props) {

  const gamekeeper = useGamekeeper()
  const players = gamekeeper.players.all()

  function handleChange(id: PlayerId, checked: boolean) {
    if (checked) {
      onChange([...playerIds, id])
    }
    else {
      onChange(playerIds.filter(i => i !== id))
    }
  }

  return (
    <div className="form-control">
      <label>Players</label>
      {players.map(player =>
        <label className="checkbox-label" key={player.id}>
          <input
            type="checkbox"
            checked={playerIds.includes(player.id)}
            onChange={e => handleChange(player.id, e.target.checked)}
          />
          {player.name}
        </label>
      )}
    </div>
  )

}