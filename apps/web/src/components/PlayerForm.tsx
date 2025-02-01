import type { NewPlayerData, PlayerData } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  onComplete: (data: NewPlayerData) => Promise<void>
  player?: PlayerData
  submitText: string
}


export function PlayerForm({ player, onComplete, submitText }: Props) {

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(player?.name ?? '')
  const [color, setColor] = useState(player?.color?.toString() ?? '')

  async function onNext() {
    // make sure there is a name
    if (name.length === 0) {
      return
    }

    const updatedPlayer: NewPlayerData = {
      name
    }
    if (color !== '') {
      updatedPlayer.color = parseInt(color)
    }

    setLoading(true)
    await onComplete(updatedPlayer)
    setLoading(false)
  }

  return (
    <>
      {/* name */}
      <div className="form-control">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label>Color</label>
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="" disabled>Select color</option>
          <option value="1">Green</option>
          <option value="2">Orange</option>
          <option value="3">Blue</option>
          <option value="4">Purple</option>
          <option value="5">Red</option>
          <option value="6">Yellow</option>
        </select>
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