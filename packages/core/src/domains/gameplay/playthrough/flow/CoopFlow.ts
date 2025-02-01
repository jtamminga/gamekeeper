import type { CoopGame } from '@domains/gameplay'
import { type NewCoopPlaythroughData, ScoringType } from '@services'
import { PlaythroughFlow } from './PlaythroughFlow'
import { InvalidState } from '@core'


export class CoopFlow extends PlaythroughFlow<CoopGame> {
  
  private playersWon?: boolean
  private score?: number

  public setScore(score: number): CoopFlow {
    if (this.game.scoring === ScoringType.NO_SCORE) {
      throw new InvalidState(['score is not allowed for this game'])
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
      throw new InvalidState(['winner must be set'])
    }

    return {
      ...this.data,
      type: 'coop',
      playersWon: this.playersWon,
      score: this.score
    }
  }
}