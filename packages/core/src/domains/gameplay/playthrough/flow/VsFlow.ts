import { type NewVsPlaythroughData, type PlayerId, ScoringType } from '@services'
import type { Player, Scores, VsGame } from '@domains/gameplay'
import { PlaythroughFlow } from './PlaythroughFlow'


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
      throw new Error('invalid state')
    }
    return this.implicitWinner
  }

  public setScores(scores: Scores): VsFlow {
    if (this.game.scoring === ScoringType.NO_SCORE) {
      throw new Error('cannot add scoring to this game')
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

  public build(): NewVsPlaythroughData {
    if (this.winnerId === undefined) {
      throw new Error('winner must be specified')
    }

    const { gameId, playedOn, playerIds } = this.data

    return {
      gameId,
      type: 'vs',
      playedOn,
      playerIds,
      winnerId: this.winnerId,
      scores: this.scores && this.scores.size > 0
        ? this.scores.toData()
        : undefined
    }
  }
}