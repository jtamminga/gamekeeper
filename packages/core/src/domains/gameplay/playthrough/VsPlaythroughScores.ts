import type { Serializable } from '@core'
import type { ScoreData } from '@services'
import type { Player } from '../player'


/**
 * Immutable score record attached to a saved `VsPlaythrough`.
 * Enriches raw score data with resolved `Player` references so consumers
 * don't need to look players up separately.
 */
export class VsPlaythroughScores implements Serializable<ReadonlyArray<ScoreData>> {

  private readonly _scores: ReadonlyArray<VsPlaythroughScore>

  public constructor(scores: ReadonlyArray<VsPlaythroughScore>) {
    this._scores = scores
  }

  public get empty(): boolean {
    return this._scores.length === 0
  }

  public get all(): ReadonlyArray<VsPlaythroughScore> {
    return this._scores
  }

  public toData(): ReadonlyArray<ScoreData> {
    return this._scores.map(score => score.toData())
  }

}

/**
 * A single player's score within a `VsPlaythrough`.
 */
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
