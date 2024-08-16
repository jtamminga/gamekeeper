import { PlayerColor } from './PlayerColor'
import { playerColorClass } from '@app/helpers'
import { PlaythroughsList } from './PlaythroughsList'
import { StatCard } from './StatCard'
import { useRouter } from '@app/hooks'
import type { FormattedScoreStats, HydratedGameView } from '@gamekeeper/core'


type Props = {
  view: HydratedGameView
}


export function GameSummary({ view }: Props) {

  const router = useRouter()

  return (
    <>
      <h3>General stats</h3>
      {renderYearVsTotalStats(view)}

      {view.scoreStats &&
        <>
          <h3>Score stats</h3>
          {renderScoreStats(view.scoreStats)}
        </>
      }
            
      <h3>Lastest playthroughs</h3>
      <PlaythroughsList
        className="mb-lg"
        formattedPlaythroughs={view.latestPlaythroughs}
      />

      {view.hasMorePlaythroughs &&
        <div className="flex h-centered">
          <button
            type="button"
            onClick={() => router.setPage({ name: 'GamePlaythroughs', props: { gameId: view.game.id } })}
          >All Playthroughs</button>
        </div>
      }
    </>
  )
}


// helpers

function renderScoreStats({ average, best }: FormattedScoreStats) {

  const bestScoreText = (
    <>best score {best.playerId && <PlayerColor playerId={best.playerId}>{best.player}</PlayerColor>}</>
  )

  return (
    <>
      <StatCard
        value={average}
        description="average score"
      />

      <StatCard
        value={best.score}
        description={bestScoreText}
      />
    </>
  )
}

function renderYearVsTotalStats({ numPlaythroughs, winrates }: HydratedGameView) {
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