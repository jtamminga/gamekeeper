import { ArrayUtils } from '@core'
import { PlayerId } from '../player'
import { Playthrough } from '../playthrough'
import { Game, GameType } from './Game'


// types
export interface StatsData {
  type: GameType
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

  public constructor(private _game: Game<T>) { }

  protected abstract isWin(playerId: PlayerId, playthough: T): boolean

  public getLastPlayed(): Date | undefined {
    return ArrayUtils.last(this._game.playthroughs)?.playedOn
  }

  public getPlayCount(): number {
    return this._game.playthroughs.length
  }

  public getWinrates(): Map<PlayerId, number> {
    const playWinData = new Map<PlayerId, PlayWinData>()
    
    // get playcount and wins for each player
    for (const playthough of this._game.playthroughs) {
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

  public getWinsteak() {
    
  }

  public getData(): StatsData {
    return {
      type: this._game.type,
      playCount: this.getPlayCount(),
      lastPlayed: this.getLastPlayed(),
      winrates: this.getWinrates()
    }
  }
}