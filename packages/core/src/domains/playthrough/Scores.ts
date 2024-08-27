import type { Serializable } from '@core'
import type { PlayerId, ScoreData } from '@services'
import { ScoringType } from '@services'


// class
export class Scores implements Serializable<ReadonlyArray<ScoreData>> {

  private _scores: Map<PlayerId, number>

  public constructor(scores: ReadonlyArray<ScoreData> = []) {
    this._scores = new Map<PlayerId, number>()
    scores.forEach(score => this._scores.set(score.playerId, score.score))
  }

  public get hasScore(): boolean {
    return this._scores.size > 0
  }

  public get size(): number {
    return this._scores.size
  }

  public get tied(): boolean {
    const scores = Array.from(this._scores.values())
    return scores.every(score => score === scores[0])
  }

  public set(playerId: PlayerId, score: number) {
    this._scores.set(playerId, score)
  }

  public remove(playerId: PlayerId) {
    this._scores.delete(playerId)
  }

  public for(playerId: PlayerId): number | undefined {
    return this._scores.get(playerId)
  }

  public highest(): ScoreData {
    if (this._scores.size === 0) {
      throw new Error('there are no scores')
    }

    let highestPlayer: PlayerId
    let highestScore: number = Number.MIN_VALUE

    for (const [playerId, score] of this._scores) {
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
    if (this._scores.size === 0) {
      throw new Error('there are no scores')
    }

    let lowestPlayer: PlayerId | undefined
    let lowestScore: number = Number.MAX_VALUE

    for (const [ playerId, score ] of this._scores) {
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

  public best(scoringType: ScoringType.HIGHEST_WINS | ScoringType.LOWEST_WINS): ScoreData {
    switch (scoringType) {
      case ScoringType.HIGHEST_WINS:
        return this.highest()
      case ScoringType.LOWEST_WINS:
        return this.lowest()
    }
  }

  public winner(scoringType: ScoringType.HIGHEST_WINS | ScoringType.LOWEST_WINS): PlayerId | null {
    if (this.tied) {
      return null
    }

    return this.best(scoringType).playerId
  }

  public toData(): ReadonlyArray<ScoreData> {
    return Array.from(this._scores, ([playerId, score]) => ({playerId, score}))
  }
}