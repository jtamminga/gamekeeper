import { Loading, Link, YearSelect } from '@app/components'
import { usePlayerView, useRouter } from '@app/hooks'
import { Callback, GameId, PlayerId } from '@gamekeeper/core'
import { GameWithWinrate } from '@gamekeeper/views'
import { useState } from 'react'


type Props = {
  playerId: PlayerId
}


export function PlayerDetails({ playerId }: Props) {

  const currentYear = new Date().getFullYear()
  const [viewingYear, setViewingYear] = useState(currentYear)
  const { toGame } = useRouter()
  const view = usePlayerView(playerId, viewingYear)
  
  if (!view) {
    return <Loading />
  }

  return (
    <>
      <div className="title-with-link">
        <h1>{view.player.name}</h1>
        <Link page={{ name: 'EditPlayer', props: { playerId }}}>Edit</Link>
      </div>

      <div className="page-subtitle">
        <h2>Top games</h2>
        <h3>{view.year}</h3>
      </div>
      {renderGamesWithWinrate(view.topGamesThisYear, toGame)}

      <div className="page-subtitle">
        <h2>Worst performances</h2>
        <h3>{view.year}</h3>
      </div>
      {renderGamesWithWinrate(view.worstGamesThisYear, toGame)}

      <div className="page-subtitle">
        <h2>Top games</h2>
        <h3>all time</h3>
      </div>
      {renderGamesWithWinrate(view.topGamesAllTime, toGame)}

      <div className="page-subtitle">
        <h2>Worst performances</h2>
        <h3>all time</h3>
      </div>
      {renderGamesWithWinrate(view.worstGamesAllTime, toGame)}

      <YearSelect
        currentYear={currentYear}
        viewingYear={viewingYear}
        setViewingYear={setViewingYear}
      />
    
    </>
  )
}


function renderGamesWithWinrate(gamesWithWinrate: GameWithWinrate[], toGame: Callback<GameId>) {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Game</th>
          <th className="num">Plays</th>
          <th>Winrate</th>
        </tr>
      </thead>
      <tbody>
        {gamesWithWinrate.map(({ gameId, gameName, numPlays, percentage }, index) =>
          <tr key={gameId} onClick={() => toGame(gameId)}>
            <td>{index + 1}</td>
            <td>{gameName}</td>
            <td className="num">{numPlays}</td>
            <td>{percentage}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}