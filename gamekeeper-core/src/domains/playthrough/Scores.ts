import { Player, PlayerId } from '../player'


// type
type ScoreResult<T extends PlayerId | Player> = {
  player: T
  score: number
}


// class
export class Scores<T extends PlayerId | Player> {

  public constructor(
    private _scores: ReadonlyMap<T, number>
  ) { }

  public get data(): ReadonlyMap<T, number> {
    return this._scores
  }

  public highest(): ScoreResult<T> {
    if (this._scores.size === 0) {
      throw new Error('there are no scores')
    }

    let highestPlayer: T
    let highestScore: number = Number.MIN_VALUE

    for (const [player, score] of this._scores) {
      if (score > highestScore) {
        highestScore = score
        highestPlayer = player
      }
    }

    return {
      player: highestPlayer!,
      score: highestScore
    }
  }

  public lowest(): ScoreResult<T> {
    if (this._scores.size === 0) {
      throw new Error('there are no scores')
    }

    let lowestPlayer: T | undefined
    let lowestScore: number = Number.MAX_VALUE

    for (const [player, score] of this._scores) {
      if (score < lowestScore) {
        lowestScore = score
        lowestPlayer = player
      }
    }

    return {
      player: lowestPlayer!,
      score: lowestScore
    }
  }
}