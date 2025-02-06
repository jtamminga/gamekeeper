import { useState } from 'react'
import { CalendarGraph, Goal, Loading, PlayerColor, PlaysByMonth, PlaythroughsList, StatCard } from '@app/components'
import { TopPlayedGames } from '@app/components/TopPlayedGames'
import { useRouter, useSummaryView } from '@app/hooks'


export function Summary() {

  const [viewingYear, setViewingYear] = useState(new Date().getFullYear())
  const view = useSummaryView(viewingYear)
  const { setPage } = useRouter()

  // render loading while waiting
  if (!view) {
    return <Loading />
  }

  const {
    year,
    currentYear,
    isCurrentYear,
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
    topPlayedGames
  } = view

  return (
    <>
      {!isCurrentYear &&
        <div className="title-with-link">
          <h1>{year} summary</h1>
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
      
      <div className="page-subtitle">
        <h2>Overall</h2>
        <h3>{year}</h3>
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
        year={year}
        data={numPlaysByMonth}
        onMonthClick={(fromDate, toDate, month) =>
          setPage({ name: 'Playthroughs', props: { fromDate, toDate, desc: `${month} ${year}` }})
        }
      />

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

      {topPlayedGames.length > 0 &&
        <>
          <div className="page-subtitle">
            <h2>Most played games</h2>
            <h3>{year}</h3>
          </div>
          <TopPlayedGames
            topPlayed={topPlayedGames}
          />
        </>
      }

      <div className="page-subtitle">
        <h2>Plays per day</h2>
        <h3>{year}</h3>
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

      <div className="text-muted mt-lg">
        go to <a role="button" onClick={() => setViewingYear(viewingYear - 1)}>previous year</a>
        {year < currentYear &&
          <> or <a role="button" onClick={() => setViewingYear(viewingYear + 1)}>next year</a></>
        }
      </div>
    </>
  )
}