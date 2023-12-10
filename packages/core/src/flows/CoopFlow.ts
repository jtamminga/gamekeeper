import { GameKeeperDeps } from '@core'
import { CoopGame, CoopPlaythroughData, PlaythroughData } from '@domains'
import { ScoringType } from '@services'


export class CoopFlow {
  
  private playersWon?: boolean
  private score?: number

  public constructor(
    private deps: GameKeeperDeps,
    private data: PlaythroughData,
    public readonly game: CoopGame
  ) { }

  public addScore(score: number): CoopFlow {
    if (this.game.scoring === ScoringType.NO_SCORE) {
      throw new Error('cannot add scoring to this game')
    }

    this.score = score
    return this
  }

  public addPlayersWon(won: boolean): CoopFlow {
    this.playersWon = won
    return this
  }

  public build(): CoopPlaythroughData {
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