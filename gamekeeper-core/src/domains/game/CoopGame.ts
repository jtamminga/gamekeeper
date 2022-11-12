import { CoopPlaythrough, CoopPlaythroughData, CoopyPlaySession, CoopyPlaySessionData } from '../playthrough'
import { CoopGameStats } from './CoopGameStats'
import { Game, GameType } from './Game'


// class
export class CoopGame extends Game<CoopPlaythrough> {

  public readonly type = GameType.COOP
  
  public start(data: Omit<CoopyPlaySessionData, 'gameId'>): CoopyPlaySession {
    if (!this.id) {
      throw new Error('game is not saved yet')
    }

    return new CoopyPlaySession({
      gameId: this.id,
      ...data
    })
  }

  public record(data: Omit<CoopPlaythroughData, 'gameId'>): CoopPlaythrough {
    if (!this.id) {
      throw new Error('game is not saved yet')
    }

    const playthrough = new CoopPlaythrough({
      gameId: this.id,
      ...data
    })

    this.addPlaythrough(playthrough)

    return playthrough
  }

  public getStats(): CoopGameStats {
    return new CoopGameStats(this.playthroughs)
  }

}