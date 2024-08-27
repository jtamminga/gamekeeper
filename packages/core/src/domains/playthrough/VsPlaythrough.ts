import { Playthrough } from './Playthrough'
import { VsPlaythroughScores } from './VsPlaythroughScores'
import type { GameKeeperDeps } from '@core'
import type { PlayerId, VsPlaythroughData } from '@services'
import type { Player } from '../player'
import type { VsGame } from '../game'


// class
export class VsPlaythrough extends Playthrough {

  public readonly winnerId: PlayerId | null
  public readonly scores: VsPlaythroughScores

  public constructor(deps: GameKeeperDeps, data: VsPlaythroughData) {
    super(deps, data)
    this.winnerId = data.winnerId
    this.scores = new VsPlaythroughScores(deps, data.scores ?? [])
  }

  public get game(): VsGame {
    return super.game as VsGame
  }

  public get winner(): Player | undefined {
    return this.winnerId === null
      ? undefined
      : this._deps.store.getPlayer(this.winnerId)
  }

  public get tied(): boolean {
    return this.winnerId === null
  }

  public override toData(): VsPlaythroughData {
    const data: VsPlaythroughData = {
      ...super.toData(),
      type: 'vs',
      winnerId: this.winnerId
    }
    if (!this.scores.empty) {
      data.scores = this.scores.toData()
    }
    return data
  }

}