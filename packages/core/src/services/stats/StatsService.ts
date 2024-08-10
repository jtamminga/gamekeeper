import type { PlayerId } from '../player'
import type { GameId } from '../game'


export type StatsQuery = {
  gameId?: GameId
  year?: number
  latestPlaythroughs?: number
}
export type WinrateDto = {
  playerId: PlayerId
  winrate: number
}
export type ScoreStatDto = { score: number, playerId?: PlayerId }
export type ScoreStatsDto = {
  highScore: ScoreStatDto
  lowScore: ScoreStatDto
  averageScore: number
}
export type PlaysByDateDto = { date: Date, plays: number }
export type StatsResultData<TData> = Record<GameId, Readonly<TData>>


export interface StatsService {

  getNumPlays(query?: StatsQuery): Promise<StatsResultData<number>>

  getWinrates(query?: StatsQuery): Promise<StatsResultData<WinrateDto[]>>

  getOverallWinrates(query?: StatsQuery): Promise<WinrateDto[]>

  getLastPlayed(query?: StatsQuery): Promise<StatsResultData<Date | undefined>>

  getNumPlaysByMonth(query?: StatsQuery): Promise<number[]>

  getNumUniqueGamesPlayed(year?: number): Promise<number>

  getScoreStats(query?: StatsQuery): Promise<StatsResultData<ScoreStatsDto | undefined>>

  getNumPlaysByDate(query?: StatsQuery): Promise<PlaysByDateDto[]>

}