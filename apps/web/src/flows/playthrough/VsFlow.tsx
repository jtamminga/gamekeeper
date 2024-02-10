import { Action, PlayerId, Scores, VsFlow } from '@gamekeeper/core'
import { ReactNode, useState } from 'react'
import { VsWinnerFlow } from './VsWinnerFlow'
import { VsScoresFlow } from './VsScoresFlow'


type Props = {
  flow: VsFlow
  onComplete: Action
}


export function VsFlowPartial({ flow, onComplete }: Props) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUpdatedAt] = useState(0)

  function onScoresComplete(scores: Scores) {
    flow.setScores(scores)
    if (flow.hasWinner) {
      onComplete()
    }
    else {
      setUpdatedAt(Date.now())
    }
  }

  function onWinnerComplete(winnerId: PlayerId | null) {
    flow.setWinner(winnerId)
    onComplete()
  }

  let content: ReactNode = null

  if (flow.needsExplicitWinner) {
    content = (
      <VsWinnerFlow
        flow={flow}
        onComplete={onWinnerComplete}
      />
    )
  }

  else {
    content = (
      <VsScoresFlow
        flow={flow}
        onComplete={onScoresComplete}
      />
    )
  }

  return content
}