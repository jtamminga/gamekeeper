import { GameKeeperDeps } from '@core'
import { Game } from '../game'
import { GameStats } from './GameStats'
import { GameId, StatsQuery as ServiceStatsQuery } from '@services'


// types
type StatsQuery = Omit<ServiceStatsQuery, 'gameId'>
export type StatsResult<TData> = Map<Game, TData>


export class Stats {

  public constructor(private _deps: GameKeeperDeps) { }

  public forGame(
    game: Game,
    query?: StatsQuery
  ): GameStats {
    return new GameStats(this._deps, game, query)
  }

  public async numPlaythroughs(query: StatsQuery): Promise<StatsResult<number>> {
    const result = await this._deps.services.statsService.getNumPlays(query)

    const map = new Map<Game, number>()
    for (const id in result) {
      const gameId = id as GameId
      map.set(this._deps.store.getGame(gameId), result[gameId])
    }

    return map
  }

  public async lastPlayed(query: StatsQuery): Promise<StatsResult<Date | undefined>> {
    const result = await this._deps.services.statsService.getLastPlayed(query)

    const map = new Map<Game, Date | undefined>()
    for (const id in result) {
      const gameId = id as GameId
      map.set(this._deps.store.getGame(gameId), result[gameId])
    }

    return map
  }

}