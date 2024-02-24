import { useState } from 'react'
import { VsScoresFlow } from './VsScoresFlow'
import { VsWinnerFlow } from './VsWinnerFlow'
import type { Action, PlayerId, Scores, VsFlow } from '@gamekeeper/core'


type Props = {
  flow: VsFlow
  onComplete: Action
}


export function VsFlowPartial({ flow, onComplete }: Props) {

  const [, setUpdatedAt] = useState(0)

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

  if (!flow.game.hasScoring || flow.needsExplicitWinner) {
    return (
      <VsWinnerFlow
        flow={flow}
        onComplete={onWinnerComplete}
      />
    )
  }

  else {
    return (
      <VsScoresFlow
        flow={flow}
        onComplete={onScoresComplete}
      />
    )
  }
}