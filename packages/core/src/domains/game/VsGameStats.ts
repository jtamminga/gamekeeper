import { GameStats, StatsData } from './GameStats'
import { VsPlaythrough } from '../playthrough'
import { GameType, PlayerId } from '@services'


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
