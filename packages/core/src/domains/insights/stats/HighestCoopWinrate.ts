import { Winrate } from './Winrate'


export class HighestCoopWinrate extends Winrate {

  public constructor(
    public readonly type: 'game' | 'players',
    public readonly winrate: number,
    public readonly plays: number
  ) {
    super(winrate, plays)
  }
}