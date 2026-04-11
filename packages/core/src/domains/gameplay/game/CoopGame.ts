import { Game } from './Game'
import { GameData, GameType } from '@services'


/**
 * A cooperative board game where all players win or lose together.
 * Playthroughs record an outcome (win/loss) and an optional group score.
 */
export class CoopGame extends Game {

  public toData(): GameData {
    return {
      ...this.toBaseData(),
      type: GameType.COOP
    }
  }

}
