import { Game, GameType, ScoringType } from './Game'
import { VsPlaythrough, VsPlaythroughData } from '../playthrough'
import { ScoreData, Scores } from 'domains/playthrough/Scores'
import { VsGameStats } from './VsGameStats'


// vs game domain
export class VsGame extends Game<VsPlaythrough> {

  public readonly type = GameType.VS

  public record(data: Omit<VsPlaythroughData, 'gameId'>): VsPlaythrough {
    if (!this.id) {
      throw new Error('game is not saved yet')
    }

    const playthrough = new VsPlaythrough({
      gameId: this.id,
      ...data
    })

    this.addPlaythrough(playthrough)

    return playthrough
  }

  public determineWinner(scores: Scores): ScoreData {

    switch (this.scoring) {
      case ScoringType.HIGHEST_WINS:
        return scores.highest()
      case ScoringType.LOWEST_WINS:
        return scores.lowest()
      default:
        throw new Error(`winner cannot be determined with scoring type`)
    }
  }

  public createStats(): VsGameStats {
    return new VsGameStats(this)
  }

}