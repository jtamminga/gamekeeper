import { Callback, PlayerId, Scores, VsFlow } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  flow: VsFlow
  onComplete: Callback<Scores>
}


export function VsScoresFlow({ flow, onComplete }: Props) {

  const [scores] = useState(new Scores())
  const [_, setUpdatedAt] = useState(0)
  
  function updateScore(playerId: PlayerId, score: number) {
    scores.set(playerId, score)
    setUpdatedAt(Date.now())
  }

  function onNext() {
    onComplete(scores)
  }

  return (
    <div>
      {flow.players.map(player =>
        <div key={player.id!}>
          {player.name}
          <input
            type="number"
            value={scores.for(player.id!) ?? 0}
            onChange={e => updateScore(player.id!, e.target.valueAsNumber)}
          />
        </div>
      )}

      <button
        onClick={onNext}
      >
        Next
      </button>
    </div>
  )
}