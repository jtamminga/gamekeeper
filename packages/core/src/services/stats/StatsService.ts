import type { PlayerId } from '../player'
import type { GameId } from '../game'


export type StatsQuery = {
  year: number
}
export type WinstreakDto = {
  playerId: PlayerId
  steak: number
}
export type WinrateDto = {
  playerId: PlayerId
  winrate: number
}


export interface StatsService {

  getNumPlaythroughs(gameId: GameId, query: StatsQuery): Promise<number>

  getWinrate(gameId: GameId, playerId: PlayerId, query: StatsQuery): Promise<number>

  getWinrates(gameId: GameId, query: StatsQuery): Promise<ReadonlyArray<WinrateDto>>

  getLastPlaythrough(gameId: GameId, query: StatsQuery): Promise<Date | undefined>

  getWinstreaks(gameId: GameId, query: StatsQuery): Promise<ReadonlyArray<WinstreakDto>>

}