import { FormattedPlaythrough, FormattedScore } from '@gamekeeper/core'
import { PlayerColor } from './PlayerColor'
import { ReactNode } from 'react'


// types
type Props = {
  playthroughs: ReadonlyArray<FormattedPlaythrough>
  hideScores?: boolean
}


/**
 * List of playthroughs
 */
export function PlaythroughsList({ playthroughs, hideScores }: Props) {
  const showGameNames = playthroughs[0].game !== undefined

  return (
    <table>
      <thead>
        <tr>
          <th className="num">Date</th>
          {showGameNames && <th>Game</th>}
          <th>Winner</th>
          {!hideScores && <th>Scores</th>}
        </tr>
      </thead>
      <tbody>
        {playthroughs.map(playthrough =>
          <tr key={playthrough.id}>

            {/* played on */}
            <td className="num">
              {playthrough.playedOn}
            </td>

            {/* game */}
            {showGameNames &&
              <td className="long">{playthrough.game}</td>
            }

            {/* winner */}
            <td>
              <PlayerColor playerId={playthrough.winnerId}>
                {playthrough.winner}
              </PlayerColor>
            </td>

            {/* scores */}
            {!hideScores &&
              <td>{renderScores(playthrough.scores)}</td>
            }

          </tr>  
        )}
      </tbody>
    </table>
  )
}


function renderScores(scores: FormattedScore[]) {
  if (scores.length === 0) {
    return null
  }

  const colorizedScores = scores
    .map<ReactNode>(({ playerId, score }) =>
      <PlayerColor key={playerId} playerId={playerId}>
        {score}
      </PlayerColor>
    )
    .reduce((pre, cur) =>
      [pre, <span key="dash" className="dash">:</span>, cur]
    )

  return (
    <div className="player-scores">
      {colorizedScores}
    </div>
  )
}