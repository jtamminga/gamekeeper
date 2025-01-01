import type { NewGoalData, GoalData } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  onComplete: (data: NewGoalData) => Promise<void>
  goal?: GoalData
  submitText: string
}


export function GoalForm({ goal, onComplete, submitText }: Props) {

  const [loading, setLoading] = useState(false)

  const [type, setType] = useState(goal?.type.toString() ?? '')
  const [value, setValue] = useState(goal?.value.toString() ?? '')
  const [year, setYear] = useState(goal?.year.toString() ?? '')

  async function onNext() {
    // make sure there is a name
    // if (name.length === 0) {
    //   return
    // }

    setLoading(true)
    await onComplete({
      type: parseInt(type),
      value: parseInt(value),
      year: parseInt(year),
    })
    setLoading(false)
  }

  return (
    <>
      {/* name */}
      <div className="form-control">
        <label>Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option disabled>Select type</option>
          <option value="1">Number of game plays</option>
        </select>
      </div>

      <div>
        <label>Goal</label>
        <input
          type="number"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      </div>

      <div>
        <label>Year</label>
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
        />
      </div>

      <button
        disabled={loading}
        onClick={onNext}
      >
        {submitText}
      </button>
    </>
  )
}