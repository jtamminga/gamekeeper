import { Callback, PlayerId, VsFlow } from '@gamekeeper/core'
import { useState } from 'react'
import { VsWinnerSelect } from './VsWinnerSelect'


type Props = {
  flow: VsFlow
  onComplete: Callback<PlayerId>
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
    <>
      <VsWinnerSelect
        flow={flow}
        winnerId={winnerId}
        onChange={winnerId => setWinnerId(winnerId)}
      />

      <button
        onClick={onNext}
      >Next</button>
    </>
  )
}