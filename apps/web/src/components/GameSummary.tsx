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

function renderYearVsTotalStats({ numPlaythroughs, winrates }: GameView) {
  return (
    <>
      <DetailedStatCard
        name={numPlaythroughs.name}
        thisYear={numPlaythroughs.valueThisYear}
        allTime={numPlaythroughs.valueAllTime}
      />
      {winrates.map((stat, index) =>
        <DetailedStatCard
          key={`stat-${index}`}
          name={stat.name}
          playerId={stat.playerId}
          thisYear={stat.valueThisYear}
          allTime={stat.valueAllTime}
        />
      )}
    </>
  )
}