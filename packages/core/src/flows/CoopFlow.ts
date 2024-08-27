import type { CoopGame, } from '@domains'
import { NewCoopPlaythroughData, ScoringType } from '@services'
import { PlaythroughFlow } from './PlaythroughFlow'


export class CoopFlow extends PlaythroughFlow<CoopGame> {
  
  private playersWon?: boolean
  private score?: number

  public setScore(score: number): CoopFlow {
    if (this.game.scoring === ScoringType.NO_SCORE) {
      throw new Error('cannot add scoring to this game')
    }

    this.score = score
    return this
  }

  public setPlayersWon(won: boolean): CoopFlow {
    this.playersWon = won
    return this
  }

  public build(): NewCoopPlaythroughData {
    if (this.playersWon === undefined) {
      throw new Error('winner must be specified')
    }

    return {
      ...this.data,
      playersWon: this.playersWon,
      score: this.score
    }
  }
}