import { GameKeeperDeps } from '@core'
import { CoopGame, CoopPlaythroughData, NewBasePlaythroughData, Player } from '@domains'
import { ScoringType } from '@services'


export class CoopFlow {
  
  private playersWon?: boolean
  private score?: number

  public constructor(
    private deps: GameKeeperDeps,
    private data: NewBasePlaythroughData,
    public readonly game: CoopGame,
    public readonly players: ReadonlyArray<Player>
  ) { }

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

  public build(): Omit<CoopPlaythroughData, 'id'> {
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