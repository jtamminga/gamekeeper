import { CoopPlaythrough } from '@domains'
import { PlaythroughFlowData } from './PlaythroughFlow'
import { ScoringType } from '@services'


type CoopFlowData = PlaythroughFlowData & {
  scoring: ScoringType
}


export class CoopFlow {
  
  private playersWon?: boolean
  private score?: number

  public constructor(private data: CoopFlowData) { }

  public addScore(score: number): CoopFlow {
    if (this.data.scoring === ScoringType.NO_SCORE) {
      throw new Error('cannot add scoring to this game')
    }

    this.score = score
    return this
  }

  public addPlayersWon(won: boolean): CoopFlow {
    this.playersWon = won
    return this
  }

  public build(): CoopPlaythrough {
    if (this.playersWon === undefined) {
      throw new Error('winner must be specified')
    }

    const { gameId, playedOn, playerIds } = this.data

    return new CoopPlaythrough(this.data.deps, {
      gameId,
      playedOn,
      playerIds,
      playersWon: this.playersWon,
      score: this.score
    })
  }
}