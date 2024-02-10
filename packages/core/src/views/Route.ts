import { GameId } from '@services'

export namespace Route {

  type StatsRoutes = {
    readonly NUM_PLAYTHROUGHS: string
    readonly WINRATES: string
    readonly LAST_PLAYTHROUGHS: string
  }

  const _stats = '/stats'

  export const GAMES = '/games'
  export const PLAYERS = '/players'
  export const PLAYTHROUGHS = '/playthroughs'
  export const STATS: StatsRoutes = {
    NUM_PLAYTHROUGHS: `${_stats}/num-plays`,
    WINRATES: `${_stats}/winrates`,
    LAST_PLAYTHROUGHS: `${_stats}/last-plays`
  }

  export function forGame(id: GameId) {
    return `${GAMES}/${id}` as const
  }

}