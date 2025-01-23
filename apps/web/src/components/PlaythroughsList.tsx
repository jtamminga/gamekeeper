import { PlayerColor } from './PlayerColor'
import { ReactNode } from 'react'
import { useRouter } from '@app/hooks'
import { FormattedPlaythroughs, FormattedScore } from '@gamekeeper/views'


// types
type Props = {
  formattedPlaythroughs: FormattedPlaythroughs
  className?: string
}


/**
 * List of playthroughs
 */
export function PlaythroughsList({ formattedPlaythroughs, className }: Props) {
  
  const { toGame, toPlaythrough } = useRouter()
  const { playthroughs, options: { gameNames, scores } } = formattedPlaythroughs

  return (
    <table className={className}>
      <thead>
        <tr>
          <th>Date</th>
          {gameNames && <th>Game</th>}
          <th>Winner</th>
          {scores && <th>Scores</th>}
        </tr>
      </thead>
      <tbody>
        {playthroughs.map(playthrough =>
          <tr key={playthrough.id}>

            {/* played on */}
            <td
              onClick={() => toPlaythrough(playthrough.id)}
            >
              {playthrough.playedOn}
            </td>

            {/* game */}
            {gameNames &&
              <td
                className="long"
                onClick={() => toGame(playthrough.gameId)}
              >
                {playthrough.game}
              </td>
            }

            {/* winner */}
            <td>
              <PlayerColor playerId={playthrough.winnerId}>
                {playthrough.winner}
              </PlayerColor>
            </td>

            {/* scores */}
            {scores && playthrough.scores &&
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