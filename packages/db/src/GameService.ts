import { DbService } from './DbService'
import { NotFoundError, GameService, GameData, GameId, GameType, ScoringType, UpdatedGameData } from '@gamekeeper/core'


// types
export interface DbGameDto {
  id: number
  name: string
  type: number
  scoring: number
  weight?: number
}


// game service
export class DbGameService extends DbService implements GameService {

  public async getGames(): Promise<readonly GameData[]> {
    const query = 'SELECT g.* FROM games g ORDER BY g.name'
    const games = await this._dataService.all<DbGameDto>(query)
    return games.map(game => transform(game))
  }

  public async getGame(id: GameId): Promise<GameData> {
    const query = 'SELECT * FROM games WHERE id=?'
    const dto = await this._dataService.get<DbGameDto>(query, id)

    if (!dto) {
      throw new NotFoundError(`cannot find game with id "${id}"`)
    }

    return transform(dto)
  }

  public async addGame(game: GameData): Promise<GameData> {
    const query = 'INSERT INTO games (name, type, scoring, weight) VALUES (?, ?, ?, ?)'
    const id = await this._dataService.insert(query, game.name, game.type, game.scoring, game.weight)
    return transform({ ...game, id })
  }
  
  public async updateGame(updatedGame: UpdatedGameData): Promise<GameData> {
    const mapping: Record<string, string> = {
      name: 'name',
      type: 'type',
      scoring: 'scoring',
      weight: 'weight'
    }

    const mappedKeys = Object.keys(updatedGame)
      .map(key => mapping[key])
      .filter(key => key !== undefined)
    const setStatements = mappedKeys
      .map(key => `${key} = ?`)
      .join(',')
    const updatedValues = mappedKeys.map(key =>
      updatedGame[key as keyof UpdatedGameData])

    const query = `UPDATE games SET ${setStatements} WHERE id = ?`
    await this._dataService.run(query, ...updatedValues, updatedGame.id)
    return this.getGame(updatedGame.id)
  }

}


// transform db game to game dto
function transform(game: DbGameDto): GameData {
  const data: GameData = {
    id: game.id.toString() as GameId,
    name: game.name,
    type: game.type as GameType,
    scoring: game.scoring as ScoringType,
  }

  if (game.weight !== undefined && game.weight !== null) {
    data.weight = game.weight
  }

  return data
}