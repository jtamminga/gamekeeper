import type { Game, GameplayDeps, Player } from '@domains/gameplay'
import type { NewBasePlaythroughData, NewPlaythroughData } from '@services'


export abstract class PlaythroughFlow<TGame extends Game = Game> {
  public constructor(
    protected deps: GameplayDeps,
    protected data: NewBasePlaythroughData,
    public readonly game: TGame,
    public readonly players: ReadonlyArray<Player>
  ) { }

  public get playedOn(): Date {
    return this.data.playedOn
  }

  public abstract build(): NewPlaythroughData
}