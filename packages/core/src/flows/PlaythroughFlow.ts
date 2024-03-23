import type { Game, NewBasePlaythroughData, NewPlaythroughData, Player } from '@domains'
import type { GameKeeperDeps } from '@core'


export abstract class PlaythroughFlow<TGame extends Game = Game> {
  public constructor(
    protected deps: GameKeeperDeps,
    protected data: NewBasePlaythroughData,
    public readonly game: TGame,
    public readonly players: ReadonlyArray<Player>
  ) { }

  public get playedOn(): Date {
    return this.data.playedOn
  }

  public abstract build(): NewPlaythroughData
}