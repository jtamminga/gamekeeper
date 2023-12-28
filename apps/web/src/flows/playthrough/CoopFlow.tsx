import { Action, CoopFlow } from '@gamekeeper/core'
import { useState } from 'react'
import { CoopWinnerSelect } from './CoopWinnerSelect'


type Props = {
  flow: CoopFlow
  onComplete: Action
}


export function CoopFlowPartial({ flow, onComplete }: Props) {

  const [score, setScore] = useState<number>()
  const [playersWon, setPlayersWon] = useState<boolean>()

  function onNext() {
    if (playersWon === undefined) {
      return
    }

    if (score) {
      flow.setScore(score)
    }

    flow.setPlayersWon(playersWon)
    onComplete()
  }

  return (
    <div>

      {flow.game.hasScoring &&
        <div>
          <input
            type="number"
            value={score}
            onChange={e => setScore(e.target.valueAsNumber)}
          />
        </div>
      }

      <CoopWinnerSelect
        playersWon={playersWon}
        onChange={playersWon => setPlayersWon(playersWon)}
      />

      <button
        onClick={onNext}
      >
        Next
      </button>

    </div>
  )

}