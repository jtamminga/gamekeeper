import { CalendarGraph, Goal, Loading, PlayerColor, PlaysByMonth, PlaythroughsList, StatCard } from '@app/components'
import { TopPlayedGames } from '@app/components/TopPlayedGames'
import { useGamekeeper, useRouter, useSummaryView } from '@app/hooks'


export function Stats() {

  const { insights } = useGamekeeper()
  const view = useSummaryView()
  const { setPage } = useRouter()

  // render loading while waiting
  if (!view) {
    return <Loading />
  }

  const {
    daysSinceLastPlaythrough,
    numPlaysThisYear,
    winnerThisYear,
    numUniqueGamesPlayedThisYear,
    numPlaysByMonth,
    latestWinner,
    latestNumPlaythorughs,
    latestPlaythroughs,
    numPlaysPerDayThisYear,
    avgPlaysPerDayThisYear,
    mostPlaysInDayThisYear,
    topPlayedGames
  } = view

  const curYear = new Date().getFullYear()

  return (
    <>
      <div className="page-subtitle">
        <h2>Goals</h2>
      </div>
      {insights.goals.topPriority &&
        <Goal goal={insights.goals.topPriority} />
      }

      <div className="page-subtitle">
        <h2>Overall</h2>
        <h3>{curYear}</h3>
      </div>

      <StatCard
        value={numPlaysThisYear}
        description="games played"
      />

      <StatCard
        value={winnerThisYear.winrate}
        description={<>best winrate <PlayerColor playerId={winnerThisYear.playerId}>{winnerThisYear.player}</PlayerColor></>}
      />

      <StatCard
        value={numUniqueGamesPlayedThisYear}
        description="unique games played"
      />

      <PlaysByMonth
        year={curYear}
        data={numPlaysByMonth}
        onMonthClick={(fromDate, toDate, month) =>
          setPage({ name: 'Playthroughs', props: { fromDate, toDate, desc: `${month} ${curYear}` }})
        }
      />

      <div className="page-subtitle">
        <h2>Recent stats</h2>
        <h3>latest {latestNumPlaythorughs} games</h3>
      </div>

      <StatCard
        value={latestWinner.winrate}
        description={<>winrate lately <PlayerColor playerId={latestWinner.playerId}>{latestWinner.player}</PlayerColor></>}
      />

      <StatCard
        value={daysSinceLastPlaythrough}
        description="days since last game"
      />

      <PlaythroughsList
        className="mt-lg"
        formattedPlaythroughs={latestPlaythroughs}
      />

      <div className="page-subtitle">
        <h2>Most played games</h2>
        <h3>{curYear}</h3>
      </div>

      <TopPlayedGames
        topPlayed={topPlayedGames}
      />

      <div className="page-subtitle">
        <h2>Plays per day</h2>
        <h3>{curYear}</h3>
      </div>

      <div className="mb-lg">
        <StatCard
          value={avgPlaysPerDayThisYear}
          description="Average plays per day"
        />

        <StatCard
          value={mostPlaysInDayThisYear}
          description="Most plays in one day"
        />
      </div>

      <CalendarGraph
        countPerDay={numPlaysPerDayThisYear.plays}
        firstDay={numPlaysPerDayThisYear.firstDate}
      />
    </>
  )
}