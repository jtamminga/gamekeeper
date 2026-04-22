import type { GameId, GoalId, PlayerId, PlaythroughId } from '@gamekeeper/core'


export namespace Route {

  const _stats = '/stats'
  const _view = '/view'

  export const GAMES = '/games'
  export const PLAYERS = '/players'
  export const PLAYTHROUGHS = '/playthroughs'
  export const GOALS = '/goals'
  export const VIEW = {
    SUMMARY: `${_view}/summary`,
    GAMES: `${_view}/games`,
    GAME: `${_view}/games/:id`,
    PLAYTHROUGHS: `${_view}/playthroughs`,
    PLAYTHROUGH: `${_view}/playthroughs/:id`,
    PLAYER: `${_view}/players/:id`,
  } as const
  export const STATS = {
    NUM_PLAYTHROUGHS: `${_stats}/num-plays`,
    WINRATES: `${_stats}/winrates`,
    OVERALL_WINRATES: `${_stats}/overall-winrates`,
    LAST_PLAYTHROUGHS: `${_stats}/last-plays`,
    PLAYS_BY_MONTH: `${_stats}/plays-by-month`,
    NUM_UNIQUE_GAMES_PLAYED: `${_stats}/num-unique-games-played`,
    SCORE_STATS: `${_stats}/score-stats`,
    HISTORICAL_SCORES: `${_stats}/historical-scores`,
    NUM_PLAYS_BY_DATE: `${_stats}/num-plays-by-date`,
    PLAY_STREAK: `${_stats}/play-streak`,
    PLAYER_WIN_STREAKS: `${_stats}/player-win-streaks`,
    OVERALL_WIN_STREAKS: `${_stats}/overall-win-streaks`
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
  export function forViewGame(id: GameId) {
    return `${_view}/games/${id}` as const
  }
  export function forViewPlayer(id: PlayerId) {
    return `${_view}/players/${id}` as const
  }
  export function forViewPlaythrough(id: PlaythroughId) {
    return `${_view}/playthroughs/${id}` as const
  }

}