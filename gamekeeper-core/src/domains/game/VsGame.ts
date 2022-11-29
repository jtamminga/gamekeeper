import { Game, GameType, ScoringType } from './Game'
import { VsPlaySession, VsPlaySessionData, VsPlaythrough, VsPlaythroughData } from '../playthrough'
import { Player, PlayerId } from '../player'
import { Scores } from 'domains/playthrough/Scores'
import { VsGameStats } from './VsGameStats'


// vs game domain
export class VsGame extends Game<VsPlaythrough> {

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

    const playthrough = new VsPlaythrough({
      gameId: this.id,
      ...data
    })

    this.addPlaythrough(playthrough)

    return playthrough
  }

  public determineWinnerFrom<T extends PlayerId | Player>(scores: Map<T, number>): T | undefined {
    const s = new Scores(scores)

    switch (this.scoring) {
      case ScoringType.HIGHEST_WINS:
        return s.highest().player
      case ScoringType.LOWEST_WINS:
        return s.lowest().player
    }
  }

  public createStats(): VsGameStats {
    return new VsGameStats(this)
  }

}