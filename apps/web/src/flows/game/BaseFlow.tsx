import { type ChangeEvent, useState } from 'react'
import type { Callback, NewGameData } from '@gamekeeper/core'


type Props = {
  onComplete: Callback<NewGameData>
}


export function BaseFlow({ onComplete }: Props) {

  const [name, setName] = useState('')
  const [type, setType] = useState('1')
  const [scoring, setScoring] = useState('1')
  const [weight, setWeight] = useState('')
  const [own, setOwn] = useState(false)

  function onTypeChange(e: ChangeEvent<HTMLInputElement>) {
    setType(e.target.value)
  }

  function onScoreTypeChange(e: ChangeEvent<HTMLInputElement>) {
    setScoring(e.target.value)
  }

  function onNext() {
    // make sure there is a name
    if (name.length === 0) {
      return
    }

    // create game data
    const data: NewGameData = {
      name,
      type: parseInt(type),
      scoring: parseInt(scoring),
      own
    }
    if (weight.length > 0) {
      data.weight = Number.parseFloat(weight)
    }

    // call on complete
    onComplete(data)
  }

  return (
    <>
      <h1>Add game</h1>

      {/* name */}
      <div className="form-control">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* game type */}
      <div className="form-control">
        <label>Type</label>
        <div className="list">
          <label>
            <input
              type="radio"
              name="game-type"
              value="1"
              checked={type === '1'}
              onChange={onTypeChange}
            />
            VS
          </label>
          <label>
            <input
              type="radio"
              name="game-type"
              value="2"
              checked={type === '2'}
              onChange={onTypeChange}
            />
            Coop
          </label>
        </div>
      </div>

      {/* scoring type */}
      <div className="form-control">
        <label>Scoring</label>
        <div className="list">
          <label>
            <input
              type="radio"
              name="scoring-type"
              value="1"
              checked={scoring === '1'}
              onChange={onScoreTypeChange}
            />
            Highest score wins
          </label>
          <label>
            <input
              type="radio"
              name="scoring-type"
              value="2"
              checked={scoring === '2'}
              onChange={onScoreTypeChange}
            />
            Lowest score wins
          </label>
          <label>
            <input
              type="radio"
              name="scoring-type"
              value="4"
              checked={scoring === '4'}
              onChange={onScoreTypeChange}
            />
            Most rounds wins
          </label>
          <label>
            <input
              type="radio"
              name="scoring-type"
              value="3"
              checked={scoring === '3'}
              onChange={onScoreTypeChange}
            />
            No score
          </label>
        </div>
      </div>

      {/* weight */}
      <div className="form-control">
        <label>Weight</label>
        <input
          type="number"
          name="weight"
          min={0}
          max={5}
          value={weight}
          onChange={e => setWeight(e.target.value)}
        />
        <p className="help-text">A scale from 0 to 5</p>
      </div>

      {/* own */}
      <div className="form-control">
        <label>Own</label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="own"
            checked={own}
            onChange={e => setOwn(e.target.checked)}
          />
          This game is in my collection
        </label>
      </div>

      <button
        onClick={onNext}
      >
        Create
      </button>
    </>
  )
}