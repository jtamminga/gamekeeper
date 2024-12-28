import type { NewPlayerData, Player } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  onComplete: (data: NewPlayerData) => Promise<void>
  player?: Player
  submitText: string
}


export function PlayerForm({ player, onComplete, submitText }: Props) {

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(player?.name ?? '')

  async function onNext() {
    // make sure there is a name
    if (name.length === 0) {
      return
    }

    setLoading(true)
    await onComplete({ name })
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

      <button
        disabled={loading}
        onClick={onNext}
      >
        {submitText}
      </button>
    </>
  )
}