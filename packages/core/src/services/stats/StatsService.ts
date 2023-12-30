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
export type StatsResult<TData> = Record<GameId, Readonly<TData>>


export interface StatsService {

  getNumPlaythroughs(query: StatsQuery): Promise<StatsResult<number>>

  getWinrates(query: StatsQuery): Promise<StatsResult<WinrateDto[]>>

  getLastPlaythroughs(query: StatsQuery): Promise<StatsResult<Date | undefined>>

}