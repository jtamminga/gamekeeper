import { GameKeeper, VsGame } from '@domains'
import { GameId, GameType } from '@services'
import { formatDate } from './utils'
import { HydratableView } from './HydratableView'


type GameWithStats = {
  id: GameId
  name: string
  type: GameType
  numPlays: number
  weight: number | undefined
  lastPlayed: Date | undefined
  lastPlayedFormatted: string | undefined
}
export type GameSortBy =
  | 'name'
  | 'numPlays'
  | 'lastPlayed'
  | 'weight'
export type GameSortOrder = 'asc' | 'desc'
export type GetGamesOptions = {
  sortBy?: GameSortBy
  order?: GameSortOrder
}
const DEFAULT_GAMES_OPTIONS: Required<GetGamesOptions> = {
  sortBy: 'name',
  order: 'asc'
}
export interface HydratedGamesView {
  all: (options?: GetGamesOptions) => ReadonlyArray<GameWithStats>
}


export class GamesView implements HydratableView<HydratedGamesView> {
  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedGamesView> {
    const [
      numPlays,
      lastPlayed
    ] = await Promise.all([
      gamekeeper.stats.numPlaythroughs({}),
      gamekeeper.stats.lastPlayed({})
    ])

    const games = gamekeeper.games.all().map(game => {
      const lastPlayedDate = lastPlayed.get(game)

      return {
        id: game.id,
        name: game.name,
        type: game instanceof VsGame ? GameType.VS : GameType.COOP,
        weight: game.weight,
        numPlays: numPlays.get(game) ?? 0,
        lastPlayed: lastPlayedDate,
        lastPlayedFormatted: lastPlayedDate ? formatDate(lastPlayedDate, true) : undefined
      }
    })

    return {
      all: (options?: GetGamesOptions) => games.sort(gamesComparer({
        ...DEFAULT_GAMES_OPTIONS,
        ...options
      }))
    }
  }
}


// helpers
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