import { NumberInput } from '@app/components'
import { Callback, PlayerId, Scores, VsFlow } from '@gamekeeper/core'
import { Fragment, useState } from 'react'


type Props = {
  flow: VsFlow
  onComplete: Callback<Scores>
}


export function VsScoresFlow({ flow, onComplete }: Props) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUpdatedAt] = useState(0)
  const [scores] = useState(new Scores())
  
  function updateScore(playerId: PlayerId, score: number | undefined) {
    if (score === undefined) {
      scores.remove(playerId)
    } else {
      scores.set(playerId, score)
    }
    
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
            <Fragment key={player.id}>
              <label>{player.name}</label>
              <NumberInput
                initialValue={scores.for(player.id)}
                onChange={num => updateScore(player.id, num)}
              />
            </Fragment>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
      >
        {scores.size === 0 ? 'Skip' : 'Next'}
      </button>
    </>
  )
}