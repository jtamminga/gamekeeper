import { Playthrough } from './Playthrough'
import type { CoopGame } from '../game'
import type { CoopPlaythroughData } from '@services'
import type { Player } from '../player'


type CoopPlaythroughArgs = Omit<CoopPlaythroughData, 'gameId' | 'playerIds'> & {
  game: CoopGame
  players: ReadonlyArray<Player>
}


/**
 * A recorded session of a cooperative game.
 * Captures whether the group won or lost, and an optional shared score.
 */
export class CoopPlaythrough extends Playthrough {

  public readonly playersWon: boolean
  public readonly score?: number

  public constructor(data: CoopPlaythroughArgs) {
    super(data)
    this.playersWon = data.playersWon
    this.score = data.score
  }

  public get game(): CoopGame {
    return super.game as CoopGame
  }

  public override toData(): CoopPlaythroughData {
    const data: CoopPlaythroughData = {
      ...super.toData(),
      type: 'coop',
      playersWon: this.playersWon
    }
    if (this.score) {
      data.score = this.score
    }
    return data
  }

}
