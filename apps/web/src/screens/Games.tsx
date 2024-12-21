import { useState } from 'react'
import { Link, Loading } from '@app/components'
import { useGamesView, useRouter } from '@app/hooks'
import { GameSortBy, sortGames } from '@gamekeeper/views'


// types
type SortByOption = {
  label: string
  sortBy: GameSortBy
  order: 'asc' | 'desc'
}
type SortByOptionRecord = Record<string, SortByOption>
const sortByOptions: SortByOptionRecord = {
  'name_asc': { label: 'Name (asc)', sortBy: 'name', order: 'asc' },
  'name_desc': { label: 'Name (desc)', sortBy: 'name', order: 'desc' },
  'plays_asc': { label: 'Plays (least first)', sortBy: 'numPlays', order: 'asc' },
  'plays_dec': { label: 'Plays (most first)', sortBy: 'numPlays', order: 'desc' },
  'played_asc': { label: 'Last Played (oldest first)', sortBy: 'lastPlayed', order: 'asc' },
  'played_desc': { label: 'Last Played (recent first)', sortBy: 'lastPlayed', order: 'desc' },
  'weight_asc': { label: 'Weight (Light first)', sortBy: 'weight', order: 'asc' },
  'weight_desc': { label: 'Weight (Heavy first)', sortBy: 'weight', order: 'desc' }
}


// component
export function Games() {
  
  // hooks
  const [ sortBy, setSortBy ] = useState('name_asc')
  const { toGame } = useRouter()
  const view = useGamesView()
  const gameOptions = sortByOptions[sortBy]
  const showWeight = gameOptions.sortBy === 'weight'

  // render loading while waiting
  if (!view) {
    return <Loading />
  }

  const { games } = view

  // render games
  return (
    <>
      <div className="flex space-between mt-lg">
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

        <Link page={{ name: 'AddGame' }}>
          Add game
        </Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th className="num">{ showWeight ? 'Weight' : 'Plays' }</th>
            <th className="num">Last Played</th>
          </tr>
        </thead>
        <tbody>
          {sortGames(games, gameOptions).map(game =>
            <tr key={game.id} onClick={() => toGame(game.id)}>
              <td>{game.name}</td>
              <td className="num">{ showWeight ? (game.weight ?? "-") : game.numPlays}</td>
              <td className="num">{ game.lastPlayedFormatted ?? <span>never played</span> }</td>
            </tr>
          )}
        </tbody>
      </table>

    </>
  )

}