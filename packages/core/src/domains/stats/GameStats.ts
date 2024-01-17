import { Winrate } from './Winrate'
import { Winrates } from './Winrates'
import type { Game } from '../game'
import type { GameKeeperDeps } from '@core'
import type { StatsQuery, StatsService, WinrateDto } from '@services'


// vs game stats
export class GameStats {

  private _statsService: StatsService

  public constructor(
    private readonly _deps: GameKeeperDeps,
    public readonly game: Game,
    private readonly _query?: Omit<StatsQuery, 'gameId'>
  ) {
    this._statsService = _deps.services.statsService
  }

  public async getNumPlaythroughs(query?: Omit<StatsQuery, 'gameId'>): Promise<number> {
    const result = await this._statsService.getNumPlays({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id] ?? 0
  }

  public async getLastPlaythrough(query?: Omit<StatsQuery, 'gameId'>): Promise<Date | undefined> {
    const result = await this._statsService.getLastPlayed({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id]
  }

  public async getWinrates(query?: Omit<StatsQuery, 'gameId'>): Promise<Winrates> {
    const result = await this._statsService.getWinrates({ ...this._query, ...query, gameId: this.game.id })
    const winrates = result[this.game.id] ?? []

    return new Winrates(winrates.map(winrate =>
      new Winrate(
        winrate,
        this._deps
      )
    ))
  }

}