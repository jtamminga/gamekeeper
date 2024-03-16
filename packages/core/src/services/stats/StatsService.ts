import type { PlayerId } from '../player'
import type { GameId } from '../game'


export type StatsQuery = {
  gameId?: GameId
  year?: number
}
export type WinrateDto = {
  playerId: PlayerId
  winrate: number
}
export type StatsResultData<TData> = Record<GameId, Readonly<TData>>


export interface StatsService {

  getNumPlays(query?: StatsQuery): Promise<StatsResultData<number>>

  getWinrates(query?: StatsQuery): Promise<StatsResultData<WinrateDto[]>>

  getOverallWinrates(year?: number): Promise<WinrateDto[]>

  getLastPlayed(query?: StatsQuery): Promise<StatsResultData<Date | undefined>>

  getNumPlaysByMonth(query?: StatsQuery): Promise<number[]>

  getNumUniqueGamesPlayed(year?: number): Promise<number>

}