import { GameStats } from './GameStats'
import type { Game } from '../game'
import type { GameId, PlaysByDateDto, StatsQuery } from '@services'
import type { GameKeeperDeps } from '@core'
import { Winrates } from './Winrates'



// types
export type OverallStatsQuery = Omit<StatsQuery, 'gameId'>
export type StatsResult<TData> = Map<Game, TData>


export class Stats {

  public constructor(private _deps: GameKeeperDeps) { }

  public forGame(
    game: Game,
    query?: OverallStatsQuery
  ): GameStats {
    return new GameStats(this._deps, game, query)
  }

  public async numPlaythroughs(query: OverallStatsQuery): Promise<StatsResult<number>> {
    const result = await this._deps.services.statsService.getNumPlays(query)

    const map = new Map<Game, number>()
    for (const id in result) {
      const gameId = id as GameId
      map.set(this._deps.store.getGame(gameId), result[gameId])
    }

    return map
  }

  public async lastPlayed(query: OverallStatsQuery): Promise<StatsResult<Date | undefined>> {
    const result = await this._deps.services.statsService.getLastPlayed(query)

    const map = new Map<Game, Date | undefined>()
    for (const id in result) {
      const gameId = id as GameId
      map.set(this._deps.store.getGame(gameId), result[gameId])
    }

    return map
  }

  public async winrates(query: OverallStatsQuery): Promise<StatsResult<Winrates>> {
    const result = await this._deps.services.statsService.getWinrates(query)

    const map = new Map<Game, Winrates>()
    for (const id in result) {
      const gameId = id as GameId
      map.set(this._deps.store.getGame(gameId), Winrates.from(result[gameId], this._deps))
    }

    return map
  }

  public async overallWinrates(query?: OverallStatsQuery): Promise<Winrates> {
    const result = await this._deps.services.statsService.getOverallWinrates(query)
    return Winrates.from(result, this._deps)
  }

  public async playsByMonth(query: OverallStatsQuery): Promise<number[]> {
    return this._deps.services.statsService.getNumPlaysByMonth(query)
  }

  public async uniqueGamesPlayed(year?: number): Promise<number> {
    return this._deps.services.statsService.getNumUniqueGamesPlayed(year)
  }

  public async numPlaysByDate(query?: OverallStatsQuery): Promise<PlaysByDateDto[]> {
    return this._deps.services.statsService.getNumPlaysByDate(query)
  }

}