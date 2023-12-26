import { GameId } from "@gamekeeper/core"

export namespace Route {

  export const GAMES = '/games'
  export const PLAYERS = '/players'
  export const PLAYTHROUGHS = '/playthroughs'

  export function forGame(id: GameId): string {
    return `${GAMES}/${id}`
  }

}