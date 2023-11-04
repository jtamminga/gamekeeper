import { ArrayUtils, GameKeeperDeps } from '@core'
import { Playthrough } from '../playthrough'
import { Game } from './Game'
import { Winrates } from 'domains/stats'
import { GameType, PlayerId } from '@services'


// types
export interface StatsData {
  type: GameType
  playCount: number
  lastPlayed: Date | undefined
  winrates: Map<PlayerId, number>
}


// vs game stats
export abstract class GameStats<T extends Playthrough> {

  public readonly playCount: number
  public readonly lastPlayed: Date | undefined
  public readonly winrates: Winrates

  public constructor(protected _deps: GameKeeperDeps, protected _game: Game<T>) {
    this.playCount = this.getPlayCount()
    this.lastPlayed = this.getLastPlayed()
    this.winrates = new Winrates(_deps, _game.playthroughs)
  }

  private getLastPlayed(): Date | undefined {
    return ArrayUtils.last(this._game.playthroughs)?.playedOn
  }

  private getPlayCount(): number {
    return this._game.playthroughs.length
  }

}