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
export type PlayStreakDto = { bestStreak: number, bestStart?: Date, currentStreak: number }
export type PlaysByDateDto = { date: Date, plays: number }
export type StatPerGame<TData> = Record<GameId, Readonly<TData>>


export interface StatsService {

  getNumPlays(query?: StatsQuery): Promise<StatPerGame<number>>

  getWinrates(query?: StatsQuery): Promise<StatPerGame<WinrateDto[]>>

  getOverallWinrates(query?: StatsQuery): Promise<WinrateDto[]>

  getLastPlayed(query?: StatsQuery): Promise<StatPerGame<Date | undefined>>

  getNumPlaysByMonth(query?: StatsQuery): Promise<number[]>

  getNumUniqueGamesPlayed(year?: number): Promise<number>

  getScoreStats(query?: StatsQuery): Promise<StatPerGame<ScoreStatsDto | undefined>>

  getNumPlaysByDate(query?: StatsQuery): Promise<PlaysByDateDto[]>

  getPlayStreak(query?: StatsQuery): Promise<PlayStreakDto>

}