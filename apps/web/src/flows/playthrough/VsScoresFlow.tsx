import { Callback, PlayerId, Scores, VsFlow } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  flow: VsFlow
  onComplete: Callback<Scores>
}


export function VsScoresFlow({ flow, onComplete }: Props) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUpdatedAt] = useState(0)
  const [scores] = useState(new Scores())
  
  function updateScore(playerId: PlayerId, score: number) {
    scores.set(playerId, score)
    setUpdatedAt(Date.now())
  }

  function onNext() {
    onComplete(scores)
  }

  return (
    <>
      <div className="form-control">
        <label>Scores</label>
        <div className="player-score-inputs">
          {flow.players.map(player =>
            <>
              <label>{player.name}</label>
              <input
                type="number"
                value={scores.for(player.id) ?? 0}
                onChange={e => updateScore(player.id, e.target.valueAsNumber)}
              />
            </>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
      >
        Next
      </button>
    </>
  )
}