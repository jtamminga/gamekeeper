import type { GameKeeperDeps } from '@core'
import type { CoopPlaythroughData } from '@services'
import type { CoopGame } from '../game'
import { Playthrough } from './Playthrough'


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
      type: 'coop',
      playersWon: this.playersWon
    }
    if (this.score) {
      data.score = this.score
    }
    return data
  }

}