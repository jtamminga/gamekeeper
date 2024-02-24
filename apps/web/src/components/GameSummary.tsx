import { HydratedGameView } from '@gamekeeper/core'
import { PlaythroughsList } from './PlaythroughsList'
import { PlayerColor } from '.'
import { playerColorClass } from '@app/helpers'


export type Props = {
  view: HydratedGameView
}


export function GameSummary({ view }: Props) {

  return (
    <>
      <h3>General stats</h3>
      {renderYearVsTotalStats(view)}

      <h3>Last playthroughs</h3>
      <PlaythroughsList playthroughs={view.latestPlaythroughs} />
    </>
  )

}

function renderYearVsTotalStats({numPlaythroughs, winrates}: HydratedGameView) {
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
        <tr>
          <td>{numPlaythroughs.name}</td>
          <td className="num">{numPlaythroughs.valueThisYear}</td>
          <td className="num">{numPlaythroughs.valueAllTime}</td>
        </tr>
        {winrates.map((stat, index) =>
          <tr key={`stat-${index}`} className={playerColorClass(stat.playerId)}>
            <td><PlayerColor playerId={stat.playerId}>{stat.name}</PlayerColor></td>
            <td className="num">{stat.valueThisYear}</td>
            <td className="num">{stat.valueAllTime}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}