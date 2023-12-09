import { PlayerId, ScoringType } from '@services'
import { PlaythroughFlowData } from './PlaythroughFlow'
import { ScoreData, Scores, VsPlaythrough } from '@domains'


type VsFlowData = PlaythroughFlowData & {
  scoring: ScoringType
}


export class VsFlow {

  private scores?: Scores
  private winner?: PlayerId

  public constructor(private data: VsFlowData) { }

  public addScores(scores: Scores): VsFlow {
    if (this.data.scoring === ScoringType.NO_SCORE) {
      throw new Error('cannot add scoring to this game')
    }

    this.scores = scores
    
    if (scores.size === this.data.playerIds.length) {
      this.winner = determineWinner(this.data.scoring, scores)
    }
    
    return this
  }

  public addWinner(winner: PlayerId): VsFlow {
    this.winner = winner
    return this
  }

  public build(): VsPlaythrough {
    if (!this.winner) {
      throw new Error('winner must be specified')
    }

    const { gameId, playedOn, playerIds } = this.data

    return new VsPlaythrough(this.data.deps, {
      gameId,
      playedOn,
      playerIds,
      winnerId: this.winner,
      scores: this.scores?.toData()
    })
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