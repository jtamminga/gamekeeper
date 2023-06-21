import { GameKeeperDeps } from '@core'
import { GameFactory } from '@factories'
import { Game, GameData, GameId } from './Game'


// types
type AllOptions = {
  noPlaythroughs: boolean
}


// class
export class Games {

  public constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(): Promise<void> {
    const dtos = await this._deps.service.gameService.getGames()
    this._deps.builder.bindGames(dtos)
  }

  public all(): ReadonlyArray<Game> {
    return Object.values(this._deps.builder.data.games)
  }

  public get<T extends Game>(id: GameId): T {
    const data = this._deps.builder.data
    return data.games[id] as T
  }

  public async create(data: GameData): Promise<Game> {
    const dto = await this._deps.service.gameService.addGame(data)
    this._deps.builder.bindGame(dto)
    return this._deps.builder.data.games[dto.id.toString() as GameId]
  }

}