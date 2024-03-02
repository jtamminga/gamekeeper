import type { GameId } from '@services'


export namespace Route {

  const _stats = '/stats'

  export const GAMES = '/games'
  export const PLAYERS = '/players'
  export const PLAYTHROUGHS = '/playthroughs'
  export const STATS = {
    NUM_PLAYTHROUGHS: `${_stats}/num-plays`,
    WINRATES: `${_stats}/winrates`,
    LAST_PLAYTHROUGHS: `${_stats}/last-plays`,
    PLAYS_BY_MONTH: `${_stats}/plays-by-month`
  } as const

  export function forGame(id: GameId) {
    return `${GAMES}/${id}` as const
  }

}