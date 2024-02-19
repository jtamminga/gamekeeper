import { Callback } from '@gamekeeper/core'


type Props = {
  value?: number
  onChange: Callback<number | undefined>
}


// component
export function NumberInput({ value, onChange }: Props) {

  function updateValue(value: string) {
    const valueAsNum = parseInt(value)
    if (isNaN(valueAsNum)) {
      onChange(undefined)
    }
    else {
      onChange(valueAsNum)
    }
  }

  return (
    <input
      type="number"
      value={typeof value === 'number' ? value.toString() : ''}
      onChange={e => updateValue(e.target.value)}
    />
  )
}