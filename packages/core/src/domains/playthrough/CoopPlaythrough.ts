import { GameKeeperDeps } from '@core'
import { CoopGame } from '../game'
import { Playthrough, BasePlaythroughData } from './Playthrough'
import { PlayerId } from '@services'
import { NewData } from '@domains'


// types
export interface CoopPlaythroughData extends BasePlaythroughData {
  playersWon: boolean
  score?: number
}
export type NewCoopPlaythroughData = NewData<CoopPlaythroughData>
export namespace CoopPlaythroughData {
  export function guard(data: BasePlaythroughData): data is CoopPlaythroughData {
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