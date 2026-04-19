import type { Game } from '@domains/gameplay'
import type { GameId, PlayerWinStreakData, PlaysByDateData, PlayStreakData, StatPerGame, StatsQuery } from '@services'
import type { InsightsDeps } from '../Insights'
import type { CoopWinrates } from './CoopWinrates'
import { GameStats } from './GameStats'
import type { Winrates } from './Winrates'
import { WinratesFactory } from './WinratesFactory'


// types
export type OverallStatsQuery = Omit<StatsQuery, 'gameId'>
export type StatsResult<TData> = Map<Game, TData>


/**
 * Entry point for querying aggregated statistics across all games.
 * All methods are async and delegate to the stats service.
 * Use `forGame()` to scope queries to a specific game.
 */
export class Stats {

  public constructor(private _deps: InsightsDeps) { }

  public forGame(
    game: Game,
    query?: OverallStatsQuery
  ): GameStats {
    return new GameStats(this._deps, game, query)
  }

  public async numPlaythroughs(query: OverallStatsQuery): Promise<StatsResult<number>> {
    const result = await this._deps.service.getNumPlays(query)
    return this.toStatsResult(result)
  }

  public async lastPlayed(query: OverallStatsQuery): Promise<StatsResult<Date | undefined>> {
    const result = await this._deps.service.getLastPlayed(query)
    return this.toStatsResult(result)
  }

  public async winrates(query: OverallStatsQuery): Promise<StatsResult<Winrates | CoopWinrates>> {
    const result = await this._deps.service.getWinrates(query)

    const map = new Map<Game, Winrates | CoopWinrates>()
    for (const id in result) {
      const gameId = id as GameId
      map.set(this._deps.gameplay.games.get(gameId), WinratesFactory.create(this._deps, result[gameId]))
    }

    return map
  }

  public async overallWinrates(query?: OverallStatsQuery): Promise<Winrates> {
    const result = await this._deps.service.getOverallWinrates(query)
    return WinratesFactory.createWinrates(this._deps, result)
  }

  public async playsByMonth(query: OverallStatsQuery): Promise<number[]> {
    return this._deps.service.getNumPlaysByMonth(query)
  }

  public async uniqueGamesPlayed(year?: number): Promise<number> {
    return this._deps.service.getNumUniqueGamesPlayed(year)
  }

  public async numPlaysByDate(query?: OverallStatsQuery): Promise<PlaysByDateData[]> {
    return this._deps.service.getNumPlaysByDate(query)
  }

  public async playStreak(query?: OverallStatsQuery): Promise<PlayStreakData> {
    return this._deps.service.getPlayStreak(query)
  }

  public async overallWinStreaks(year?: number): Promise<PlayerWinStreakData[]> {
    return this._deps.service.getOverallWinStreaks(year)
  }

  public async playerWinStreaks(query?: OverallStatsQuery): Promise<StatsResult<PlayerWinStreakData[]>> {
    const result = await this._deps.service.getPlayerWinStreaks(query)
    return this.toStatsResult(result)
  }

  private toStatsResult<T>(data: StatPerGame<T>): StatsResult<T> {
    const map = new Map<Game, T>()
    for (const id in data) {
      const gameId = id as GameId
      map.set(this._deps.gameplay.games.get(gameId), data[gameId])
    }

    return map
  }

}