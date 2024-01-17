import { DbService } from './DbService'
import { NotFoundError, GameService, GameDto, GameId, GameData, GameType, ScoringType } from '@gamekeeper/core'


// types
export interface DbGameDto {
  id: number
  name: string
  type: number
  scoring: number
}


// game service
export class DbGameService extends DbService implements GameService {

  public async getGames(): Promise<readonly GameDto[]> {
    const query = 'SELECT g.* FROM games g ORDER BY g.name'
    const games = await this._dataService.all<DbGameDto>(query)
    return games.map(game => transform(game))
  }

  public async getGame(id: GameId): Promise<GameDto> {
    const query = 'SELECT * FROM games WHERE id=?'
    const dto = await this._dataService.get<DbGameDto>(query, id)

    if (!dto) {
      throw new NotFoundError(`cannot find game with id "${id}"`)
    }

    return transform(dto)
  }

  public async addGame(game: GameData): Promise<GameDto> {
    const query = 'INSERT INTO games (name, type, scoring) VALUES (?, ?, ?)'
    const id = await this._dataService.insert(query, game.name, game.type, game.scoring)
    return transform({ ...game, id })
  }

}


// transform db game to game dto
function transform(game: DbGameDto): GameDto {
  return {
    id: game.id.toString() as GameId,
    name: game.name,
    type: game.type as GameType,
    scoring: game.scoring as ScoringType
  }
}