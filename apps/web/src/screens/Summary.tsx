import { useState } from 'react'
import { CalendarGraph, Goal, Loading, PlayerColor, PlaysByMonth, PlaythroughsList, StatCard, YearSelect } from '@app/components'
import { TopPlayedGames } from '@app/components/TopPlayedGames'
import { useRouter, useSummaryView } from '@app/hooks'


export function Summary() {

  const currentYear = new Date().getFullYear()
  const [viewingYear, setViewingYear] = useState(currentYear)
  const view = useSummaryView(viewingYear)
  const { setPage } = useRouter()
  const isCurrentYear = currentYear === viewingYear

  // render loading while waiting
  if (!view) {
    return <Loading />
  }

  const {
    goals,
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
    topPlayedGames,
    playStreakThisYear
  } = view

  return (
    <>
      {!isCurrentYear &&
        <div className="title-with-link">
          <h1>{viewingYear} summary</h1>
          <a role="button" onClick={() => setViewingYear(currentYear)}>Current year</a>
        </div>
      }

      {goals.length > 0 &&
        <>
          <div className="page-subtitle">
            <h2>Goals</h2>
          </div>
          {goals.map(goal =>
            <Goal key={goal.id} goal={goal} />
          )}
        </>
      }
      
      {/* overall stats */}
      <div className="page-subtitle">
        <h2>Overall</h2>
        <h3>{viewingYear}</h3>
      </div>
      <StatCard
        value={numPlaysThisYear}
        description="games played"
      />
      {winnerThisYear &&
        <StatCard
          value={winnerThisYear.winrate}
          description={<>best winrate <PlayerColor playerId={winnerThisYear.playerId}>{winnerThisYear.player}</PlayerColor></>}
        />
      }
      <StatCard
        value={numUniqueGamesPlayedThisYear}
        description="unique games played"
      />
      <PlaysByMonth
        year={viewingYear}
        data={numPlaysByMonth}
        onMonthClick={(fromDate, toDate, month) =>
          setPage({ name: 'Playthroughs', props: { fromDate, toDate, desc: `${month} ${viewingYear}` }})
        }
      />

      {/* recent stats */}
      {isCurrentYear && latestPlaythroughs.playthroughs.length > 0 &&
        <>
          <div className="page-subtitle">
            <h2>Recent stats</h2>
            <h3>latest {latestNumPlaythorughs} games</h3>
          </div>
          {latestWinner &&
            <StatCard
              value={latestWinner.winrate}
              description={<>winrate lately <PlayerColor playerId={latestWinner.playerId}>{latestWinner.player}</PlayerColor></>}
            />
          }
          <StatCard
            value={daysSinceLastPlaythrough}
            description="days since last game"
          />
          <PlaythroughsList
            className="mt-lg"
            formattedPlaythroughs={latestPlaythroughs}
          />
        </>
      }

      {/* top played games */}
      {topPlayedGames.length > 0 &&
        <>
          <div className="page-subtitle">
            <h2>Most played games</h2>
            <h3>{viewingYear}</h3>
          </div>
          <TopPlayedGames
            topPlayed={topPlayedGames}
          />
        </>
      }

      {/* game day stats */}
      <div className="page-subtitle">
        <h2>Game day</h2>
        <h3>{viewingYear}</h3>
      </div>
      <div className="mb-lg">
        <StatCard
          value={avgPlaysPerDayThisYear}
          description="average plays per day"
        />
        <StatCard
          value={mostPlaysInDayThisYear}
          description="most plays in one day"
        />
        {playStreakThisYear.bestStreak > 1 &&
          <StatCard
            value={playStreakThisYear.bestStreak}
            description="best game day streak"
          />
        }
      </div>
      <CalendarGraph
        countPerDay={numPlaysPerDayThisYear.plays}
        firstDay={numPlaysPerDayThisYear.firstDate}
      />

      {/* year select */}
      <YearSelect
        currentYear={currentYear}
        viewingYear={viewingYear}
        setViewingYear={setViewingYear}
      />
    </>
  )
}