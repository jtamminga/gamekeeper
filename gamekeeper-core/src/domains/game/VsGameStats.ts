import { GameStats, StatsData } from './GameStats'
import { PlayerId } from 'domains/player'
import { VsPlaythrough } from '../playthrough'
import { GameType } from './Game'


// interface
type Winrate = { playerId: PlayerId, winrate: number }
export interface VsStatsData extends StatsData {
  bestWinrate?: Winrate
}


// vs game stats
export class VsGameStats extends GameStats<VsPlaythrough> {

  protected isWin(playerId: PlayerId, playthough: VsPlaythrough): boolean {
    return playerId === playthough.winnerId
  }

  public override getData(): VsStatsData {
    // get data
    const data = super.getData()

    // find best winrate
    let bestWinrate: Winrate | undefined
    for (const [playerId, winrate] of data.winrates) {
      if (bestWinrate === undefined || winrate > bestWinrate.winrate) {
        bestWinrate = { playerId, winrate }
      }
    }

    // return data
    return {
      ...data,
      bestWinrate
    }
  }

}


// guards
export function isVsStatsData(data: StatsData): data is VsStatsData {
  return data.type === GameType.VS
}
