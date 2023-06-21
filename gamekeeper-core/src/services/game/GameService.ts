import { NotFoundError } from '@core'
import { CoopGame, Game, GameData, GameId, GameType, VsGame } from '@domains'
import type { DataService } from '@services'


// types
export interface GameDto {
  id: number
  name: string
  type: number
  scoring: number
}


// repository
export class GameService {

  public constructor(
    private _dataService: DataService
  ) { }

  public async getGames(): Promise<readonly GameDto[]> {
    const query = 'SELECT * FROM games'
    return this._dataService.all<GameDto>(query)
  }

  public async getGame(id: GameId): Promise<GameDto> {
    const query = 'SELECT * FROM games WHERE id=?'
    const dto = await this._dataService.get<GameDto>(query, id)

    if (!dto) {
      throw new NotFoundError(`cannot find game with id "${id}"`)
    }

    return dto
  }

  public async addGame(game: GameData): Promise<GameDto> {
    const query = 'INSERT INTO games (name, type, scoring) VALUES (?, ?, ?)'
    const id = await this._dataService.insert(query, game.name, game.type, game.scoring)
    return { ...game, id }
  }

}