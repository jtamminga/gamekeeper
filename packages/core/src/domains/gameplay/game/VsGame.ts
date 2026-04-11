import { Game } from './Game'
import { GameData, GameType } from '@services'


/**
 * A competitive (vs) board game where one player wins against the others.
 * Playthroughs record a winner and optional per-player scores.
 */
export class VsGame extends Game {

  public toData(): GameData {
    return {
      ...this.toBaseData(),
      type: GameType.VS
    }
  }

}
