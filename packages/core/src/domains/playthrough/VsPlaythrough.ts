import { GameKeeperDeps } from '@core'
import { VsGame } from '../game'
import { Playthrough, BasePlaythroughData } from './Playthrough'
import { ScoreData, Scores } from './Scores'
import { PlayerId } from '@services'
import { Player, type NewData } from '@domains'
import { VsPlaythroughScores } from './VsPlaythroughScores'


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
  public readonly scores: VsPlaythroughScores

  public constructor(deps: GameKeeperDeps, data: VsPlaythroughData) {
    super(deps, data)
    this.winnerId = data.winnerId
    this.scores = new VsPlaythroughScores(deps, data.scores ?? [])
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
    if (this.scores.all.length > 0) {
      data.scores = this.scores.toData()
    }
    return data
  }

}