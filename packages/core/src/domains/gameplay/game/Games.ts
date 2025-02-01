import { InvalidState, LimitError } from '@core'
import { GameValidation } from './GameValidation'
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
    const result = GameValidation.create(data)
    if (!result.valid) {
      throw new InvalidState(result.errors)
    }
    if (this._deps.repo.games.length >= 100) {
      throw new LimitError('limit of 100 games')
    }

    return this._deps.repo.createGame(data)
  }

  public async save(game: Game): Promise<void> {
    const updatedData = game.toData()
    const result = GameValidation.update(updatedData)
    if (!result.valid) {
      throw new InvalidState(result.errors)
    }
    
    await this._deps.repo.updateGame(updatedData)
  }

  public toData(): ReadonlyArray<GameData> {
    return this.all().map(game => game.toData())
  }

}

