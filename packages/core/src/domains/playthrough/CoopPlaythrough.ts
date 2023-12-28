import { GameKeeperDeps } from '@core'
import { CoopGame } from '../game'
import { Playthrough, PlaythroughData } from './Playthrough'
import { PlayerId } from '@services'


// types
export interface CoopPlaythroughData extends PlaythroughData {
  playersWon: boolean
  score?: number
}
export namespace CoopPlaythroughData {
  export function guard(data: PlaythroughData): data is CoopPlaythroughData {
    return Object.hasOwn(data, 'playersWon')
  }
}


// class
export class CoopPlaythrough extends Playthrough {

  public readonly playersWon: boolean
  public readonly score?: number

  public constructor(deps: GameKeeperDeps, data: CoopPlaythroughData) {
    super(deps, data)
    this.playersWon = data.playersWon
    this.score = data.score
  }

  public get game(): CoopGame {
    return super.game as CoopGame
  }

  public get winnerName(): string {
    return this.playersWon
      ? 'players'
      : 'game'
  }

  public didWinBy(playerId: PlayerId): boolean {
    return this.playersWon && this.playerIds.includes(playerId)
  }

  public override toData(): CoopPlaythroughData {
    const data: CoopPlaythroughData = {
      ...super.toData(),
      playersWon: this.playersWon
    }
    if (this.score) {
      data.score = this.score
    }
    return data
  }

}