import { Game, GameType, ScoringType } from './Game'
import { VsPlaySession, VsPlaySessionData, VsPlaythrough, VsPlaythroughData } from '../playthrough'
import { Player } from '../player'
import { Scores } from 'domains/playthrough/Scores'


// vs game domain
export class VsGame extends Game {

  public readonly type = GameType.VS
  
  public start(data: Omit<VsPlaySessionData, 'gameId'>): VsPlaySession {
    if (!this.id) {
      throw new Error('game is not saved yet')
    }

    return new VsPlaySession({
      gameId: this.id,
      ...data
    })
  }

  public record(data: Omit<VsPlaythroughData, 'gameId'>): VsPlaythrough {
    if (!this.id) {
      throw new Error('game is not saved yet')
    }

    return new VsPlaythrough({
      gameId: this.id,
      ...data
    })
  }

  public determineWinnerFrom(scores: Map<Player, number>): Player | undefined {
    const s = new Scores(scores)

    switch (this.scoring) {
      case ScoringType.HIGHEST_WINS:
        return s.highest().player
      case ScoringType.LOWEST_WINS:
        return s.lowest().player
    }
  }

}