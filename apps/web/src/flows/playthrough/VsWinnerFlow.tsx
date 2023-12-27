import { VsWinnerSelect } from '@app/components'
import { PlayerId, VsFlow } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  flow: VsFlow
  onComplete: (winnerId: PlayerId) => void
}


export function VsWinnerFlow({ flow, onComplete }: Props) {

  const [winnerId, setWinnerId] = useState<PlayerId>()

  function onNext() {
    if (winnerId === undefined) {
      return
    }

    onComplete(winnerId)
  }

  return (
    <div>

      <VsWinnerSelect
        flow={flow}
        winnerId={winnerId}
        onChange={winnerId => setWinnerId(winnerId)}
      />

      <button
        onClick={onNext}
      >Next</button>

    </div>
  )
}