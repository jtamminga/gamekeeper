import { NumberInput } from '@app/components'
import { Callback, Player, ScoreData, Scores, VsFlow } from '@gamekeeper/core'
import { Fragment, useState } from 'react'


type Props = {
  flow: VsFlow
  onComplete: Callback<Scores>
}
type PlayerScore = {
  player: Player
  score?: number
}


export function VsScoresFlow({ flow, onComplete }: Props) {

  const [playerScores, setPlayerScores] = useState<PlayerScore[]>(
    flow.players.map(player => ({ player }))
  )
  
  function updateScore(player: Player, score: number | undefined) {
    setPlayerScores(playerScores.map(playerScore =>
      playerScore.player === player
        ? { player, score }
        : playerScore
    ))
  }

  const scoreData = playerScores
    .map(playerScore => ({ playerId: playerScore.player.id, score: playerScore.score }))
    .filter(playerScore => playerScore.score !== undefined) as  ScoreData[]

  function onNext() {
    onComplete(new Scores(scoreData))
  }

  return (
    <>
      <div className="form-control">
        <label>Scores</label>
        <div className="player-score-inputs">
          {playerScores.map(({ player, score }) =>
            <Fragment key={player.id}>
              <label>{player.name}</label>
              <NumberInput
                value={score}
                onChange={num => updateScore(player, num)}
              />
            </Fragment>
          )}
        </div>
      </div>

      <button
        onClick={onNext}
      >
        {scoreData.length === 0 ? 'Skip' : 'Next'}
      </button>
    </>
  )
}