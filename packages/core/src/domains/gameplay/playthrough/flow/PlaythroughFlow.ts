import type { Game, Gameplay, GameplayDeps, Player, Playthrough } from '@domains/gameplay'
import type { NewBasePlaythroughData, NewPlaythroughData } from '@services'


/**
 * Abstract builder for recording a new playthrough step by step.
 * Holds the in-progress data until `build()` is called to persist it.
 * Subclasses (CoopFlow, VsFlow) add game-type-specific setters.
 *
 * Use `Playthroughs.startFlow()` to create a flow instance.
 */
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

  public abstract buildData(): NewPlaythroughData

  public async build(): Promise<Playthrough> {
    return this.deps.repo.createPlaythrough(this.buildData())
  }

  public static defaultPlayerSelection({ playthroughs, players }: Gameplay): ReadonlyArray<Player> {
    const lastPlaythrough = playthroughs.last()
    let _players = players.all()

    if (lastPlaythrough) {
      // only include players that are still valid (not deleted)
      _players = lastPlaythrough.players
        .filter(player => _players.includes(player))
    }

    return _players
  }
}