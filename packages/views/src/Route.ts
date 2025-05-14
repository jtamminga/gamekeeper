import type { GameId, GoalId, PlayerId, PlaythroughId } from '@gamekeeper/core'


export namespace Route {

  const _stats = '/stats'

  export const GAMES = '/games'
  export const PLAYERS = '/players'
  export const PLAYTHROUGHS = '/playthroughs'
  export const GOALS = '/goals'
  export const STATS = {
    NUM_PLAYTHROUGHS: `${_stats}/num-plays`,
    WINRATES: `${_stats}/winrates`,
    OVERALL_WINRATES: `${_stats}/overall-winrates`,
    LAST_PLAYTHROUGHS: `${_stats}/last-plays`,
    PLAYS_BY_MONTH: `${_stats}/plays-by-month`,
    NUM_UNIQUE_GAMES_PLAYED: `${_stats}/num-unique-games-played`,
    SCORE_STATS: `${_stats}/score-stats`,
    NUM_PLAYS_BY_DATE: `${_stats}/num-plays-by-date`,
    PLAY_STREAK: `${_stats}/play-streak`
  } as const

  export function forGame(id: GameId) {
    return `${GAMES}/${id}` as const
  }
  export function forPlayer(id: PlayerId) {
    return `${PLAYERS}/${id}` as const
  }
  export function forGoal(id: GoalId) {
    return `${GOALS}/${id}` as const
  }
  export function forPlaythrough(id: PlaythroughId) {
    return `${PLAYTHROUGHS}/${id}` as const
  }

}