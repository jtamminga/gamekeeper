import { HydratedPlaythroughView } from '@gamekeeper/core'


export type Props = {
  view: HydratedPlaythroughView
}


export function PlaythroughSummary({ view }: Props) {

  return (
    <>
      <h3>General stats</h3>
      {renderYearVsTotalStats(view)}

      <h3>Last playthroughs</h3>
      {renderLatestPlaythroughs(view)}
    </>
  )

}

function renderYearVsTotalStats({stats}: HydratedPlaythroughView) {
  return (
    <table>
      <thead>
        <tr>
          <th>Stat</th>
          <th className="num">This year</th>
          <th className="num">All Time</th>
        </tr>
      </thead>
      <tbody>
        {stats.map((stat, index) =>
          <tr key={`stat-${index}`}>
            <td>{stat.name}</td>
            <td className="num">{stat.valueThisYear}</td>
            <td className="num">{stat.valueAllTime}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

function renderLatestPlaythroughs({latestPlaythroughs}: HydratedPlaythroughView) {
  return (
    <table>
      <thead>
        <tr>
          <th className="num">Date</th>
          <th>Winner</th>
          <th>Scores</th>
        </tr>
      </thead>
      <tbody>
        {latestPlaythroughs.map(playthrough =>
          <tr key={playthrough.id}>
            <td className="num">{playthrough.playedOn}</td>
            <td>{playthrough.winner}</td>
            <td>{playthrough.scores.map(score => `${score.name}: ${score.score}`).join(', ')}</td>
          </tr>  
        )}
      </tbody>
    </table>
  )
}