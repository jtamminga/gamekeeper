import { Link, Loading } from '@app/components'
import { useGamekeeper } from '@app/hooks'
import { GameSortBy, GamesView, HydratedGamesView } from '@gamekeeper/core'
import { useEffect, useState } from 'react'


type SortByOption = {
  label: string
  sortBy: GameSortBy
  order: 'asc' | 'desc'
}
type SortByOptionRecord = Record<string, SortByOption>
const sortByOptions: SortByOptionRecord = {
  '1': { label: 'Name (asc)', sortBy: 'name', order: 'asc' },
  '2':{ label: 'Name (desc)', sortBy: 'name', order: 'desc' },
  '3':{ label: 'Plays (asc)', sortBy: 'numPlays', order: 'asc' },
  '4':{ label: 'Plays (desc)', sortBy: 'numPlays', order: 'desc' },
  '5':{ label: 'Last Played (asc)', sortBy: 'lastPlayed', order: 'asc' },
  '6':{ label: 'Last Played (desc)', sortBy: 'lastPlayed', order: 'desc' },
}


export function Games() {
  
  // hooks
  const gamekeeper = useGamekeeper()
  const [view, setView] = useState<HydratedGamesView>()
  const [sortBy, setSortBy] = useState('1')
  const gameOptions = sortByOptions[sortBy]

  // fetch data
  useEffect(() => {
    async function fetchData() {
      const view = await new GamesView().hydrate(gamekeeper)
      setView(view)
    }
    fetchData()
  }, [gamekeeper])

  // render loading while waiting
  if (!view) {
    return <Loading />
  }

  // render games
  return (
    <>
      <div className="flex space-between">
        <div className="form-control">
          <label>Order by</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            {Object.keys(sortByOptions).map(sortById =>
              <option key={sortById} value={sortById}>{sortByOptions[sortById].label}</option>
            )}
          </select>
        </div>

        <Link page="AddGame">
          Add game
        </Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th className="num">Plays</th>
            <th className="num">Last Played</th>
          </tr>
        </thead>
        <tbody>
          {view.all(gameOptions).map(game =>
            <tr key={game.id}>
              <td>{game.name}</td>
              <td className="num">{game.numPlays}</td>
              <td className="num">{game.lastPlayedFormatted ?? <span>never played</span>}</td>
            </tr>
          )}
        </tbody>
      </table>

    </>
  )

}