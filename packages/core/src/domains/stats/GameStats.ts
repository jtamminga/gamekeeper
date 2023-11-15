import { Winrate } from './Winrate'
import { Winrates } from './Winrates'
import type { Game } from '../game'
import type { GameType, PlayerId, StatsQuery, StatsService } from '@services'


// types
export interface StatsData {
  type: GameType
  playCount: number
  lastPlayed: Date | undefined
  winrates: Map<PlayerId, number>
}


// vs game stats
export class GameStats {

  public constructor(
    public readonly game: Game,
    private readonly _query: StatsQuery,
    private readonly _statsService: StatsService
  ) { }

  public async getNumPlaythroughs(): Promise<number> {
    return this._statsService.getNumPlaythroughs(this.game.id!, this._query)
  }

  public async getLastPlaythrough(): Promise<Date | undefined> {
    return this._statsService.getLastPlaythrough(this.game.id!, this._query)
  }

  public async getWinrates(): Promise<Winrates> {
    const winrates = await this._statsService.getWinrates(this.game.id!, this._query)

    return new Winrates(winrates.map(winrate =>
      new Winrate(
        winrate.playerId,
        winrate.winrate
      )
    ))
  }

}