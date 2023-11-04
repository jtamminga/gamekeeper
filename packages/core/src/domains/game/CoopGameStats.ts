import { GameType } from '@services'
import { CoopPlaythrough } from '../playthrough'
import { Game } from './Game'
import { GameStats, StatsData } from './GameStats'
import { GameKeeperDeps } from '@core'


// interface
export interface CoopStatsData extends StatsData {
  playersWinrate: number
}


// coop game stats
export class CoopGameStats extends GameStats<CoopPlaythrough> {

  public readonly playersWinrate: number

  public constructor(_deps: GameKeeperDeps, _game: Game<CoopPlaythrough>) {
    super(_deps, _game)

    // calculate players average winrate vs game
    let total = 0
    for (const [_, winrate] of this.winrates.map) {
      total += winrate
    }

    this.playersWinrate = total / this.winrates.map.size
  }

}


// guards
export function isCoopStatsData(data: StatsData): data is CoopStatsData {
  return data.type === GameType.COOP
}