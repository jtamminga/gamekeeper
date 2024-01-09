import { GameKeeperDeps, Serializable } from '@core'
import { ScoreData } from './Scores'
import { Player } from '../player'


export class VsPlaythroughScores implements Serializable<ReadonlyArray<ScoreData>> {

  private readonly _scores: ReadonlyArray<VsPlaythroughScore>

  public constructor(deps: GameKeeperDeps, scores: ReadonlyArray<ScoreData>) {
    this._scores = scores.map(score =>
      new VsPlaythroughScore(deps.store.getPlayer(score.playerId), score.score)
    )
  }

  public get all(): ReadonlyArray<VsPlaythroughScore> {
    return this._scores
  }

  public toData(): ReadonlyArray<ScoreData> {
    return this._scores.map(score => score.toData())
  }

}

export class VsPlaythroughScore implements Serializable<ScoreData> {

  public constructor(
    public readonly player: Player,
    public readonly value: number
  ) { }

  public toData(): ScoreData {
    return {
      playerId: this.player.id,
      score: this.value
    }
  }
  
}