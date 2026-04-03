import type { Player } from '@domains/gameplay'


export class PlayerWinrate {

  public constructor(
    public readonly player: Player,
    public readonly winrate: number,
    public readonly plays: number
  ) { }
}