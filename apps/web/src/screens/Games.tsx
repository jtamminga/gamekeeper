import { GameSortBy, GamesView } from '@gamekeeper/core'
import { Link, Loading } from '@app/components'
import { useRouter, useView } from '@app/hooks'
import { useState } from 'react'


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
  'played_asc': { label: 'Last Played (least recent first)', sortBy: 'lastPlayed', order: 'asc' },
  'played_desc': { label: 'Last Played (most recent first)', sortBy: 'lastPlayed', order: 'desc' },
}


// component
export function Games() {
  
  // hooks
  const [sortBy, setSortBy] = useState('name_asc')
  const gameOptions = sortByOptions[sortBy]
  const { setPage } = useRouter()
  const { hydratedView } = useView(() => new GamesView())

  // render loading while waiting
  if (!hydratedView) {
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

        <Link page={{ name: 'AddGame' }}>
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
          {hydratedView.all(gameOptions).map(game =>
            <tr key={game.id} onClick={() => setPage({ name: 'GameDetails', props: { gameId: game.id } })}>
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