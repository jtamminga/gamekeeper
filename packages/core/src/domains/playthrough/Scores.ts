import { Serializable } from '@core'
import { PlayerId } from '@services'


// type
export type ScoreData = {
  playerId: PlayerId
  score: number
}


// class
export class Scores implements Serializable<ReadonlyArray<ScoreData>> {


  public constructor(
    private _scores: ReadonlyArray<ScoreData>
  ) { }

  public get hasScore(): boolean {
    return this._scores.length > 0
  }

  public get size(): number {
    return this._scores.length
  }

  public highest(): ScoreData {
    if (this._scores.length === 0) {
      throw new Error('there are no scores')
    }

    let highestPlayer: PlayerId
    let highestScore: number = Number.MIN_VALUE

    for (const { playerId, score } of this._scores) {
      if (score > highestScore) {
        highestScore = score
        highestPlayer = playerId
      }
    }

    return {
      playerId: highestPlayer!,
      score: highestScore
    }
  }

  public lowest(): ScoreData {
    if (this._scores.length === 0) {
      throw new Error('there are no scores')
    }

    let lowestPlayer: PlayerId | undefined
    let lowestScore: number = Number.MAX_VALUE

    for (const { playerId, score } of this._scores) {
      if (score < lowestScore) {
        lowestScore = score
        lowestPlayer = playerId
      }
    }

    return {
      playerId: lowestPlayer!,
      score: lowestScore
    }
  }

  public toData(): ReadonlyArray<ScoreData> {
    return this._scores
  }
}