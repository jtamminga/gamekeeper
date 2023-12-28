import { PlayerId, VsFlow } from '@gamekeeper/core'


type Props = {
  flow: VsFlow
  winnerId: PlayerId | undefined
  onChange: (id: PlayerId) => void
}


export function VsWinnerSelect({ flow, winnerId, onChange }: Props) {

  return (
    <select
      value={winnerId ?? ''}
      onChange={e => onChange(e.target.value as PlayerId)}
    >
      <option value="" disabled>select winner</option>
      {flow.players.map(player =>
        <option key={player.id} value={player.id}>{player.name}</option>  
      )}
    </select>
  )
}