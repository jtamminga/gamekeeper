import { Callback } from '@gamekeeper/core'


type Props = {
  playersWon: boolean | undefined
  onChange: Callback<boolean>
}


export function CoopWinnerSelect({ playersWon, onChange }: Props) {

  // convert playersWon to string for select
  const value = playersWon === undefined
    ? ''
    : playersWon ? '1' : '0'

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value === '1')}
    >
      <option value="">select winner</option>
      <option value="0">game won</option>
      <option value="1">players won</option>
    </select>
  )
}


