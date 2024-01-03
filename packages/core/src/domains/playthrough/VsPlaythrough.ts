import { GameKeeperDeps } from '@core'
import { VsGame } from '../game'
import { Playthrough, BasePlaythroughData } from './Playthrough'
import { ScoreData, Scores } from './Scores'
import { PlayerId } from '@services'
import { Player, type NewData } from '@domains'


// types
export interface VsPlaythroughData extends BasePlaythroughData {
  winnerId: PlayerId
  scores?: ReadonlyArray<ScoreData>
}
export type NewVsPlaythroughData = NewData<VsPlaythroughData>
export namespace VsPlaythroughData {
  export function guard(data: BasePlaythroughData): data is VsPlaythroughData {
    return Object.hasOwn(data, 'winnerId')
  }
}


// class
export class VsPlaythrough extends Playthrough {

  public readonly winnerId: PlayerId
  public readonly scores?: Scores

  public constructor(deps: GameKeeperDeps, data: VsPlaythroughData) {
    super(deps, data)
    this.winnerId = data.winnerId
    this.scores = data.scores
      ? new Scores(data.scores)
      : undefined
  }

  public get game(): VsGame {
    return super.game as VsGame
  }

  public get winner(): Player {
    return this._deps.store.getPlayer(this.winnerId)
  }

  public override toData(): VsPlaythroughData {
    const data: VsPlaythroughData = {
      ...super.toData(),
      winnerId: this.winnerId
    }
    if (this.scores && this.scores.size > 0) {
      data.scores = this.scores.toData()
    }
    return data
  }

}