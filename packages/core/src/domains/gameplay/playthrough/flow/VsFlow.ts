import { type NewVsPlaythroughData, type PlayerId, ScoringType } from '@services'
import type { Player, Scores, VsGame } from '@domains/gameplay'
import { PlaythroughFlow } from './PlaythroughFlow'
import { InvalidState } from '@core'


export class VsFlow extends PlaythroughFlow<VsGame> {

  private scores?: Scores
  private winnerId?: PlayerId | null
  private implicitWinner?: boolean

  public get winner(): Player | undefined {
    return this.winnerId
      ? this.deps.repo.getPlayer(this.winnerId)
      : undefined
  }

  public get hasWinner(): boolean {
    return this.winnerId !== undefined && this.winnerId !== null
  }

  public get needsExplicitWinner(): boolean {
    return this.scores !== undefined && !this.hasWinner
  }

  public get isImplicitWinner(): boolean {
    if (this.implicitWinner === undefined) {
      throw new InvalidState(['cannot determine the winner'])
    }
    return this.implicitWinner
  }

  public setScores(scores: Scores): VsFlow {
    if (this.game.scoring === ScoringType.NO_SCORE) {
      throw new InvalidState(['cannot add scoring to this game'])
    }

    this.scores = scores

    // make sure all players have scores
    if (scores.size === this.data.playerIds.length) {
      this.winnerId = scores.winner(this.game.scoring)
      this.implicitWinner = true
    }

    return this
  }

  public setWinner(winner: PlayerId | null): VsFlow {
    this.winnerId = winner
    this.implicitWinner = false
    return this
  }

  public buildData(): NewVsPlaythroughData {
    if (this.winnerId === undefined) {
      throw new InvalidState(['winner must be set'])
    }

    return {
      ...this.data,
      type: 'vs',
      winnerId: this.winnerId,
      scores: this.scores && this.scores.size > 0
        ? this.scores.toData()
        : undefined
    }
  }
}