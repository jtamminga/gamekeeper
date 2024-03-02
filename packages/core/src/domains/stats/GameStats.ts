import { Winrate } from './Winrate'
import { Winrates } from './Winrates'
import type { Game } from '../game'
import type { GameKeeperDeps } from '@core'
import type { DomainStatsQuery } from './Stats'
import type { StatsService } from '@services'


// vs game stats
export class GameStats {

  private _statsService: StatsService

  public constructor(
    private readonly _deps: GameKeeperDeps,
    public readonly game: Game,
    private readonly _query?: DomainStatsQuery
  ) {
    this._statsService = _deps.services.statsService
  }

  public async numPlaythroughs(query?: DomainStatsQuery): Promise<number> {
    const result = await this._statsService.getNumPlays({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id] ?? 0
  }

  public async lastPlaythrough(query?: DomainStatsQuery): Promise<Date | undefined> {
    const result = await this._statsService.getLastPlayed({ ...this._query, ...query, gameId: this.game.id })
    return result[this.game.id]
  }

  public async winrates(query?: DomainStatsQuery): Promise<Winrates> {
    const result = await this._statsService.getWinrates({ ...this._query, ...query, gameId: this.game.id })
    const winrates = result[this.game.id] ?? []

    return new Winrates(winrates.map(winrate =>
      new Winrate(
        winrate,
        this._deps
      )
    ))
  }

  public async playsByMonth(query?: DomainStatsQuery): Promise<number[]> {
    return this._deps.services.statsService.getNumPlaysByMonth({ ...query, gameId: this.game.id })
  }

}