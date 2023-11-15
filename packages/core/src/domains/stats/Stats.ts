import { GameKeeperDeps } from '@core'
import { Playthrough } from '../playthrough'
import { Game } from '../game'
import { GameStats } from './GameStats'
import { StatsQuery } from '@services'


export class Stats {

  public constructor(private _deps: GameKeeperDeps) { }

  public forGame(
    game: Game,
    query: StatsQuery = { year: new Date().getFullYear() }
  ): GameStats {
    return new GameStats(game, query, this._deps.services.statsService)
  }

}