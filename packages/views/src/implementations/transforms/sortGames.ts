import { GameSortBy, GameWithStats, GetGamesOptions } from '@def/views'

const DEFAULT_GAMES_OPTIONS: Required<GetGamesOptions> = {
  sortBy: 'name',
  order: 'asc'
}


export function sortGames(games: ReadonlyArray<GameWithStats>, options: GetGamesOptions = {}): ReadonlyArray<GameWithStats> {
  return games.slice().sort(gamesComparer({ ...DEFAULT_GAMES_OPTIONS, ...options }))
}

function getSortableValue(game: GameWithStats, sortBy: GameSortBy): string | number {
  switch (sortBy) {
    case 'name':
      return game.name
    case 'lastPlayed':
      return game.lastPlayed?.getTime() ?? 0
    case 'numPlays':
      return game.numPlays
    case 'weight':
      return game.weight ?? 0
  }
}
function gamesComparer({ sortBy, order }: Required<GetGamesOptions>): (a: GameWithStats, b: GameWithStats) => number {
  return (a: GameWithStats, b: GameWithStats) => {
    const aValue = getSortableValue(a, sortBy)
    const bValue = getSortableValue(b, sortBy)
    const ascending = order === 'asc'

    if (aValue > bValue) {
      return ascending ? 1 : -1
    }
    else if (aValue < bValue) {
      return ascending ? -1 : 1
    }
    else {
      return 0
    }
  }
}