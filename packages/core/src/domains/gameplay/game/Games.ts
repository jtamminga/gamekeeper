import { LimitError } from '@core'
import { GameData, GameId, NewGameData } from '@services'
import type { GameplayDeps } from '../Gameplay'
import type { Game } from './Game'


const MAX_GAMES = 100


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
    NewGameData.throwIfInvalid(data)
    if (this._deps.repo.games.length >= MAX_GAMES) {
      throw new LimitError(`Cannot create more than ${MAX_GAMES} games`)
    }

    return this._deps.repo.createGame(data)
  }

  public async save(game: Game): Promise<void> {
    const updatedData = game.toData()
    GameData.throwIfInvalid(updatedData)
    
    await this._deps.repo.updateGame(updatedData)
  }

  public toData(): ReadonlyArray<GameData> {
    return this.all().map(game => game.toData())
  }

}

