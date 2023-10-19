import { GameStats, StatsData } from './GameStats'
import { PlayerId } from 'domains/player'
import { VsPlaythrough } from '../playthrough'
import { GameType } from './Game'


// interface
type Winrate = { playerId: PlayerId, winrate: number }
type VsWinstreak = { playerId: PlayerId, streak: number }
export interface VsStatsData extends StatsData {
  bestWinrate?: Winrate
  winstreaks: ReadonlyArray<VsWinstreak>
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

    // get current winstreak
    const winstreaks = this.getWinstreaks()

    // return data
    return {
      ...data,
      bestWinrate,
      winstreaks
    }
  }

  public getWinstreaks(): ReadonlyArray<VsWinstreak> {
    const streaks: VsWinstreak[] = []
    let curWinner: PlayerId | undefined
    let streak = 0
    for (const playthrough of this._game.playthroughs) {
      if (playthrough.winnerId === curWinner) {
        streak++
      } else {
        if (curWinner) {
          streaks.push({
            playerId: curWinner,
            streak
          })
        }
        
        curWinner = playthrough.winnerId
        streak = 1
      }
    }

    if (curWinner) {
      streaks.push({
        playerId: curWinner,
        streak
      })
    }

    return streaks
  }

}


// guards
export function isVsStatsData(data: StatsData): data is VsStatsData {
  return data.type === GameType.VS
}
