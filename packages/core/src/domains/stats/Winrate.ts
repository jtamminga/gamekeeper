import { Player } from 'domains/player'

export class Winrate {
  public constructor(public readonly player: Player, public readonly winrate: number) {
    
  }
}