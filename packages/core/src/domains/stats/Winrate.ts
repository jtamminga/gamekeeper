import { PlayerId } from '@services'


export class Winrate {
  public constructor(
    public readonly playerId: PlayerId,
    public readonly winrate: number
  ) { }
}