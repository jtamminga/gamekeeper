import { CoopPlaythrough, CoopPlaythroughData } from '../playthrough'
import { CoopGameStats } from './CoopGameStats'
import { Game, GameType } from './Game'


// class
export class CoopGame extends Game<CoopPlaythrough> {

  public readonly type = GameType.COOP

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

  public createStats(): CoopGameStats {
    return new CoopGameStats(this)
  }

}