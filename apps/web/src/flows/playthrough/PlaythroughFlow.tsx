import { ReactNode, useState } from 'react'
import { CoopFlow, VsFlow } from '@gamekeeper/core'
import { VsFlowPartial } from './VsFlow'
import { BaseFlow } from './BaseFlow'


type Props = {
  onComplete: (flow: VsFlow | CoopFlow) => void
}


export function PlaythroughFlow({ onComplete }: Props) {

  const [flow, setFlow] = useState<VsFlow | CoopFlow>()

  let contents: ReactNode = null

  if (flow === undefined) {
    contents = (
      <BaseFlow
        onComplete={flow => setFlow(flow)}
      />
    )
  }

  else if (flow instanceof VsFlow) {
    contents = (
      <VsFlowPartial
        flow={flow}
        onComplete={() => onComplete(flow)}
      />
    )
  }

  return (
    <div>
      {contents}
    </div>
  )
}