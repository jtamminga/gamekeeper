import type { GameplayDeps } from '../Gameplay'
import type { Game } from './Game'
import type { GameData, GameId, NewGameData } from '@services'


export class Games {

  public constructor(
    private _deps: GameplayDeps
  ) { }

  public async hydrate(): Promise<Games> {
    await this._deps.repo.hydrateGames()
    return this
  }

  public all(): ReadonlyArray<Game> {
    return this._deps.repo.games
  }

  public get<T extends Game>(id: GameId): T {
    return this._deps.repo.getGame(id) as T
  }

  public async create(data: NewGameData): Promise<Game> {
    return this._deps.repo.createGame(data)
  }

  public toData(): ReadonlyArray<GameData> {
    return this.all().map(game => game.toData())
  }

}

