import { GameStats } from './GameStats'
import type { Game } from '../game'
import type { GameId, StatsQuery as ServiceStatsQuery } from '@services'
import type { GameKeeperDeps } from '@core'



// types
export type DomainStatsQuery = Omit<ServiceStatsQuery, 'gameId'>
export type StatsResult<TData> = Map<Game, TData>


export class Stats {

  public constructor(private _deps: GameKeeperDeps) { }

  public forGame(
    game: Game,
    query?: DomainStatsQuery
  ): GameStats {
    return new GameStats(this._deps, game, query)
  }

  public async numPlaythroughs(query: DomainStatsQuery): Promise<StatsResult<number>> {
    const result = await this._deps.services.statsService.getNumPlays(query)

    const map = new Map<Game, number>()
    for (const id in result) {
      const gameId = id as GameId
      map.set(this._deps.store.getGame(gameId), result[gameId])
    }

    return map
  }

  public async lastPlayed(query: DomainStatsQuery): Promise<StatsResult<Date | undefined>> {
    const result = await this._deps.services.statsService.getLastPlayed(query)

    const map = new Map<Game, Date | undefined>()
    for (const id in result) {
      const gameId = id as GameId
      map.set(this._deps.store.getGame(gameId), result[gameId])
    }

    return map
  }

  // TODO: add winrates which is a combination of all winrates
  // public async winrates(query: DomainStatsQuery): Promise<Winrates> {
  //   const result = await this._deps.services.statsService.getWinrates(query)

  //   for (const id in result) {
  //     const gameId = id as GameId
  //     result[gameId]
  //   }
  // }

  public async playsByMonth(query: DomainStatsQuery): Promise<number[]> {
    return this._deps.services.statsService.getNumPlaysByMonth(query)
  }

}