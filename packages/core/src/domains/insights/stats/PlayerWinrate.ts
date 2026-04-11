import type { Player } from '@domains/gameplay'
import { Winrate } from './Winrate'


/**
 * A specific player's win rate for a game.
 * Extends `Winrate` with a resolved `Player` reference.
 */
export class PlayerWinrate extends Winrate {

  public constructor(
    public readonly player: Player,
    public readonly winrate: number,
    public readonly plays: number
  ) {
    super(winrate, plays)
  }
}