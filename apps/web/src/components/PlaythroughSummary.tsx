import { HydratedPlaythroughView } from '@gamekeeper/core'
import { PlaythroughsList } from './PlaythroughsList'


export type Props = {
  view: HydratedPlaythroughView
}


export function PlaythroughSummary({ view }: Props) {

  return (
    <>
      <h3>General stats</h3>
      {renderYearVsTotalStats(view)}

      <h3>Last playthroughs</h3>
      <PlaythroughsList playthroughs={view.latestPlaythroughs} />
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