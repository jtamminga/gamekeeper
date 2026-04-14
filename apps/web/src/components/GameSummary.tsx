import { useRouter } from '@app/hooks'
import { GameView } from '@gamekeeper/views'
import { CalendarGraph } from './CalendarGraph'
import { PlayerColor } from './PlayerColor'
import { PlaythroughsList } from './PlaythroughsList'
import { StatCard } from './StatCard'
import { ScoreScatterPlot } from './ScoreScatterPlot'


type Props = {
  view: GameView
}


export function GameSummary({ view }: Props) {

  const router = useRouter()
  const {
    year,
    game,
    winnerAllTime,
    numPlaythroughs,
    scoreStats,
    winrates,
    latestPlaythroughs,
    hasMorePlaythroughs,
    numPlaysPerDayThisYear
  } = view

  return (
    <>
      <h3>General stats</h3>
      {winnerAllTime &&
        <StatCard
          value={winnerAllTime.percentage}
          description={
            <>
              all time best <PlayerColor playerId={winnerAllTime.playerId}>{winnerAllTime.name}</PlayerColor>
            </>
          }
        />
      }
      <div className="flex gap-md">
        <StatCard
          value={numPlaythroughs.valueThisYear}
          description={`plays in ${year}`}
        />
        <StatCard
          value={numPlaythroughs.valueAllTime}
          description="plays all time"
        />
      </div>

      {scoreStats &&
        <>
          <h3>Score stats</h3>
  
          <StatCard
            value={scoreStats.average}
            description="average score"
          />

          <div className="flex gap-md">
            <StatCard
              value={scoreStats.best.score}
              description={
                <>best {scoreStats.best.playerId && <PlayerColor playerId={scoreStats.best.playerId}>{scoreStats.best.player}</PlayerColor>}</>
              }
            />
            <StatCard
              value={scoreStats.worst.score}
              description={
                <>worst {scoreStats.worst.playerId && <PlayerColor playerId={scoreStats.worst.playerId}>{scoreStats.worst.player}</PlayerColor>}</>
              }
            />
          </div>
          
          <ScoreScatterPlot
            scoreStats={scoreStats}
          />
        </>
      }

      <h3>Winrates</h3>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th className="num">{year}</th>
            <th>#</th>
            <th className="num">All</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          {winrates.map(({playerId, name, numPlaysThisYear, valueThisYear, numPlaysAllTime, valueAllTime}, index) =>
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
        formattedPlaythroughs={latestPlaythroughs}
      />
      {hasMorePlaythroughs &&
        <div className="flex h-centered mb-lg">
          <button
            type="button"
            onClick={() => router.setPage({ name: 'GamePlaythroughs', props: { gameId: game.id } })}
          >All Playthroughs</button>
        </div>
      }

      <CalendarGraph
        countPerDay={numPlaysPerDayThisYear.plays}
        firstDay={numPlaysPerDayThisYear.firstDate}
      />
    </>
  )
}