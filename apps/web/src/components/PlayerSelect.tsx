import { useState } from 'react'
import { Player, PlayerId } from '@gamekeeper/core'
import { useGamekeeper } from '../hooks'


const ABOVE_FOLD_COUNT = 6


type Props = {
  playerIds: ReadonlyArray<PlayerId>
  onChange: (ids: PlayerId[]) => void
}


export function PlayerSelect({ playerIds, onChange }: Props) {

  const { gameplay } = useGamekeeper()
  const players = gameplay.players.sortedBy('recentlyPlayed')
  const firstPlayers = players.slice(0, ABOVE_FOLD_COUNT) // above fold players
  const extraPlayers = players.slice(ABOVE_FOLD_COUNT) // below fold players
  const [extraOpen, setExtraOpen] = useState(() =>
    extraPlayers.some(p => playerIds.includes(p.id))
  )

  function handleChange(id: PlayerId, checked: boolean) {
    if (checked) {
      onChange([...playerIds, id])
    }
    else {
      onChange(playerIds.filter(i => i !== id))
    }
  }

  function renderCheckbox(player: Player) {
    return (
      <label className="checkbox-label" key={player.id}>
        <input
          type="checkbox"
          checked={playerIds.includes(player.id)}
          onChange={e => handleChange(player.id, e.target.checked)}
        />
        {player.name}
      </label>
    )
  }

  return (
    <div className="form-control">
      <label>Players</label>
      <div className="player-select-list">
        {firstPlayers.map(renderCheckbox)}
      </div>
      {extraPlayers.length > 0 &&
        <details
          className="player-select-more"
          open={extraOpen}
          onToggle={e => setExtraOpen(e.currentTarget.open)}
        >
          <summary>More players</summary>
          <div className="player-select-list">
            {extraPlayers.map(renderCheckbox)}
          </div>
        </details>
      }
    </div>
  )

}
