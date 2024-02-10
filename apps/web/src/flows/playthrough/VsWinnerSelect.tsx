import { PlayerId, VsFlow } from '@gamekeeper/core'


type Props = {
  flow: VsFlow
  winnerId?: PlayerId | null
  onChange: (id: PlayerId | null) => void
}


export function VsWinnerSelect({ flow, winnerId, onChange }: Props) {

  let winnerValue: string
  switch (winnerId) {
    case undefined:
      winnerValue = ''
      break
    case null:
      winnerValue = 'tie'
      break
    default:
      winnerValue = winnerId
      break
  }

  function onWinnerChange(winnerValue: string) {
    let winnerId: PlayerId | null
    switch (winnerValue) {
      case '':
        throw new Error('invalid winner')
      case 'tie':
        winnerId = null
        break
      default:
        winnerId = winnerValue as PlayerId
        break
    }

    onChange(winnerId)
  }

  return (
    <div className="form-control">
      <label>Winner</label>
      <select
        value={winnerValue}
        onChange={e => onWinnerChange(e.target.value)}
      >
        <option value="" disabled>select winner</option>
        <option value="tie">tie</option>
        {flow.players.map(player =>
          <option key={player.id} value={player.id}>{player.name}</option>  
        )}
      </select>
    </div>
  )
}