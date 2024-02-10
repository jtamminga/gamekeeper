import { FormattedPlaythrough } from '@gamekeeper/core'


// types
type Props = {
  playthroughs: ReadonlyArray<FormattedPlaythrough>
}


// component
export function PlaythroughsList({ playthroughs }: Props) {
  const showGameNames = playthroughs[0].game !== undefined

  return (
    <table>
      <thead>
        <tr>
          <th className="num">Date</th>
          {showGameNames && <th>Game</th>}
          <th>Winner</th>
          <th>Scores</th>
        </tr>
      </thead>
      <tbody>
        {playthroughs.map(playthrough =>
          <tr key={playthrough.id}>
            <td className="num">{playthrough.playedOn}</td>
            {showGameNames && <td>{playthrough.game}</td>}
            <td>{playthrough.winner}</td>
            <td>{playthrough.scores.map(score => `${score.name}: ${score.score}`).join(', ')}</td>
          </tr>  
        )}
      </tbody>
    </table>
  )
}