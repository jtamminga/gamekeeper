import { GameKeeperDeps } from '@core'
import { Game, GameData, GameId } from './Game'


// class
export class Games {

  public constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(): Promise<Games> {
    const dtos = await this._deps.service.gameService.getGames()
    this._deps.builder.bindGames(dtos)
    return this
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

  public toData(): ReadonlyArray<GameData> {
    return this.all().map(game => game.toData())
  }

  public toMapData(): Readonly<Record<GameId, GameData>> {
    const data: Record<GameId, GameData> = { }
    for (const gameData of this.toData()) {
      data[gameData.id!] = gameData
    }
    return data
  }

}