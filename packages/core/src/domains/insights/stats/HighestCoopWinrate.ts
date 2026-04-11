import { Winrate } from './Winrate'


/**
 * The highest win rate within a coop game context.
 * `type` indicates whether the winning perspective is 'game' (all sessions)
 * or 'players' (sessions a specific player was in).
 */
export class HighestCoopWinrate extends Winrate {

  public constructor(
    public readonly type: 'game' | 'players',
    public readonly winrate: number,
    public readonly plays: number
  ) {
    super(winrate, plays)
  }
}