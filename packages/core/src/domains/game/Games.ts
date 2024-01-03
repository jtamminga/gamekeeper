import type { GameKeeperDeps } from '@core'
import type { Game, GameData, NewGameData } from './Game'
import type { GameId } from '@services'


// class
export class Games {

  public constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(): Promise<Games> {
    const dtos = await this._deps.services.gameService.getGames()
    this._deps.logger.info(`games hydrated: ${dtos.length} records`)
    this._deps.store.bindGames(dtos)
    return this
  }

  public all(): ReadonlyArray<Game> {
    return this._deps.store.games
  }

  public get<T extends Game>(id: GameId): T {
    return this._deps.store.getGame(id) as T
  }

  public async create(data: NewGameData): Promise<Game> {
    const dto = await this._deps.services.gameService.addGame(data)
    return this._deps.store.bindGame(dto)
  }

  public toData(): ReadonlyArray<GameData> {
    return this.all().map(game => game.toData())
  }

}