import { Callback } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  initialValue?: number
  onChange: Callback<number | undefined>
}


// component
export function NumberInput({ initialValue, onChange }: Props) {

  const [value, setValue] = useState(typeof initialValue === 'number' ? initialValue.toString() : '')

  function updateValue(value: string) {
    setValue(value)

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
      pattern="\d*"
      value={value}
      onChange={e => updateValue(e.target.value)}
    />
  )
}