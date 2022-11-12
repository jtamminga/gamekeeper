import { ArrayUtils } from '@core'
import { PlayerId } from '../player'
import { Playthrough } from '../playthrough'


// types
export interface StatsData {
  playCount: number
  lastPlayed: Date | undefined
  winrates: Map<PlayerId, number>
}
type PlayWinData = {
  plays: number
  wins: number
}


// vs game stats
export abstract class GameStats<T extends Playthrough> {

  public constructor(private _playthroughs: readonly T[]) { }

  protected abstract isWin(playerId: PlayerId, playthough: T): boolean

  public getLastPlayed(): Date | undefined {
    return ArrayUtils.last(this._playthroughs)?.playedOn
  }

  public getPlayCount(): number {
    return this._playthroughs.length
  }

  public getWinrates(): Map<PlayerId, number> {
    const playWinData = new Map<PlayerId, PlayWinData>()
    
    // get playcount and wins for each player
    for (const playthough of this._playthroughs) {
      for (const playerId of playthough.playerIds) {
        const winrateData = playWinData.get(playerId) ?? { plays: 0, wins: 0 }
        winrateData.plays++
        winrateData.wins += this.isWin(playerId, playthough) ? 1 : 0
        playWinData.set(playerId, winrateData)
      }
    }

    // calculate the winrates
    const winrateData = new Map<PlayerId, number>()
    for (const [playerId, data] of playWinData) {
      winrateData.set(playerId, data.wins / data.plays)
    }

    return winrateData
  }

  public getData(): StatsData {
    return {
      playCount: this.getPlayCount(),
      lastPlayed: this.getLastPlayed(),
      winrates: this.getWinrates()
    }
  }


}