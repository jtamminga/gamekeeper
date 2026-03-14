import { PlayerColor } from './PlayerColor'
import { PlaythroughsList } from './PlaythroughsList'
import { StatCard } from './StatCard'
import { useRouter } from '@app/hooks'
import { CalendarGraph } from './CalendarGraph'
import { DetailedStatCard } from './DetailedStatCard'
import { FormattedScoreStats, GameView } from '@gamekeeper/views'


type Props = {
  view: GameView
}


export function GameSummary({ view }: Props) {

  const router = useRouter()

  return (
    <>
      <h3>General stats</h3>
      <DetailedStatCard
        year={view.year}
        name={view.numPlaythroughs.name}
        thisYear={view.numPlaythroughs.valueThisYear}
        allTime={view.numPlaythroughs.valueAllTime}
      />

      {view.scoreStats &&
        <>
          <h3>Score stats</h3>
          {renderScoreStats(view.scoreStats)}
        </>
      }

      <h3>Winrates</h3>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th className="num">{view.year}</th>
            <th>#</th>
            <th className="num">All</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          {view.winrates.map(({playerId, name, numPlaysThisYear, valueThisYear, numPlaysAllTime, valueAllTime}, index) =>
            <tr key={`stat-${index}`} onClick={() => router.toPlayer(playerId)}>
              <td>
                <PlayerColor playerId={playerId}>{name}</PlayerColor>
              </td>
              <td className="num">{valueThisYear}</td>
              <td className="text-muted">{numPlaysThisYear}</td>
              <td className="num">{valueAllTime}</td>
              <td className="text-muted">{numPlaysAllTime}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Lastest playthroughs</h3>
      <PlaythroughsList
        className="mb-lg"
        formattedPlaythroughs={view.latestPlaythroughs}
      />

      {view.hasMorePlaythroughs &&
        <div className="flex h-centered mb-lg">
          <button
            type="button"
            onClick={() => router.setPage({ name: 'GamePlaythroughs', props: { gameId: view.game.id } })}
          >All Playthroughs</button>
        </div>
      }

      <CalendarGraph
        countPerDay={view.numPlaysPerDayThisYear.plays}
        firstDay={view.numPlaysPerDayThisYear.firstDate}
      />
    </>
  )
}


// helpers
function renderScoreStats({ average, best, worst }: FormattedScoreStats) {
  return (
    <>
      <StatCard
        value={average}
        description="average score"
      />

      <StatCard
        value={best.score}
        description={
          <>best score {best.playerId && <PlayerColor playerId={best.playerId}>{best.player}</PlayerColor>}</>
        }
      />

      <StatCard
        value={worst.score}
        description={
          <>worst score {worst.playerId && <PlayerColor playerId={worst.playerId}>{worst.player}</PlayerColor>}</>
        }
      />
    </>
  )
}