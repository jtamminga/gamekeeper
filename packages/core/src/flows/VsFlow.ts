import { PlayerId, ScoringType } from '@services'
import { Player, PlaythroughData, Scores, VsGame, VsPlaythroughData } from '@domains'
import { GameKeeperDeps } from '@core'


export class VsFlow {

  private scores?: Scores
  private winnerId?: PlayerId
  private implicitWinner?: boolean

  public constructor(
    private deps: GameKeeperDeps,
    private data: PlaythroughData,
    public readonly game: VsGame
  ) { }

  public get winner(): Player | undefined {
    return this.winnerId
      ? this.deps.store.getPlayer(this.winnerId)
      : undefined
  }

  public get hasWinner(): boolean {
    return this.winnerId !== undefined
  }

  public get isImplicitWinner(): boolean {
    if (this.implicitWinner === undefined) {
      throw new Error('invalid state')
    }
    return this.implicitWinner
  }

  public addScores(scores: Scores): VsFlow {
    if (this.game.scoring === ScoringType.NO_SCORE) {
      throw new Error('cannot add scoring to this game')
    }

    this.scores = scores
    
    // make sure all players have scores
    if (scores.size === this.data.playerIds.length) {
      this.winnerId = determineWinner(this.game.scoring, scores)
      this.implicitWinner = true
    }
    
    return this
  }

  public addWinner(winner: PlayerId): VsFlow {
    this.winnerId = winner
    this.implicitWinner = false
    return this
  }

  public build(): VsPlaythroughData {
    if (this.winnerId === undefined) {
      throw new Error('winner must be specified')
    }

    const { gameId, playedOn, playerIds } = this.data

    return {
      gameId,
      playedOn,
      playerIds,
      winnerId: this.winnerId,
      scores: this.scores?.toData()
    }
  }
}


// helper
function determineWinner(type: ScoringType, scores: Scores): PlayerId | undefined {
  switch (type) {
    case ScoringType.HIGHEST_WINS:
      return scores.highest().playerId
    case ScoringType.LOWEST_WINS:
      return scores.lowest().playerId
    default:
      throw new Error(`winner cannot be determined with no scoring type`)
  }
}