import type { Playthrough, UpdatedPlaythroughData } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  onComplete: (data: Omit<UpdatedPlaythroughData, 'id'>) => Promise<void>
  playthrough?: Playthrough
  submitText: string
}


export function PlaythroughForm({ playthrough, onComplete, submitText }: Props) {

  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState(playthrough?.notes ?? '')

  async function onNext() {
    const updatedPlaythrough: Omit<UpdatedPlaythroughData, 'id'> = {}
    if (notes !== '') {
      updatedPlaythrough.notes = notes
    }

    setLoading(true)
    await onComplete(updatedPlaythrough)
    setLoading(false)
  }

  return (
    <>
      {/* notes */}
      <div className="form-control">
        <label>Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>

      {/* save */}
      <button
        disabled={loading}
        onClick={onNext}
      >
        {submitText}
      </button>
    </>
  )
}
