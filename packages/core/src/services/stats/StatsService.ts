import type { GameId } from '../game'
import type { PlayerWinrateData, CoopWinratesData, ScoreStatsData, HistoricalScoreData, PlayStreakData, PlaysByDateData, WinrateData, PlayerWinStreakData } from './StatsData'


export type StatsQuery = {
  gameId?: GameId
  year?: number
  latestPlaythroughs?: number
}
export type StatPerGame<TData> = Record<GameId, TData>


export interface StatsService {

  getNumPlays(query?: StatsQuery): Promise<StatPerGame<number>>

  getWinrates(query?: StatsQuery): Promise<StatPerGame<PlayerWinrateData[] | CoopWinratesData>>

  getOverallWinrates(query?: StatsQuery): Promise<PlayerWinrateData[]>

  getLastPlayed(query?: StatsQuery): Promise<StatPerGame<Date | undefined>>

  getNumPlaysByMonth(query?: StatsQuery): Promise<number[]>

  getNumUniqueGamesPlayed(year?: number): Promise<number>

  getScoreStats(query?: StatsQuery): Promise<StatPerGame<ScoreStatsData | undefined>>

  getHistoricalScores(query?: StatsQuery): Promise<StatPerGame<HistoricalScoreData[]>>

  getNumPlaysByDate(query?: StatsQuery): Promise<PlaysByDateData[]>

  getPlayStreak(query?: StatsQuery): Promise<PlayStreakData>

  getOverallWinStreaks(year?: number): Promise<PlayerWinStreakData[]>

  getPlayerWinStreaks(query?: StatsQuery): Promise<StatPerGame<PlayerWinStreakData[]>>

}
