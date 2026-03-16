import { DbService } from './DbService'
import { NotFoundError, GameService, GameData, GameId, GameType, ScoringType, UpdatedGameData, NewGameData } from '@gamekeeper/core'
import { UserId, whereUserId } from './User'


// types
export interface DbGameDto {
  id: number
  name: string
  type: number
  scoring: number
  weight?: number
  own: number
}


// game service
export class DbGameService extends DbService implements GameService {

  public async getGames(userId?: UserId): Promise<readonly GameData[]> {
    const query = `SELECT g.* FROM games g WHERE g.${whereUserId(userId)} ORDER BY g.name`
    const games = await this._dataService.all<DbGameDto>(query, userId)
    return games.map(game => this.transform(game))
  }

  public async getGame(id: GameId, userId?: UserId): Promise<GameData> {
    const query = `SELECT * FROM games WHERE id=? AND ${whereUserId(userId)}`
    const dto = await this._dataService.get<DbGameDto>(query, id, userId)

    if (!dto) {
      throw new NotFoundError(`cannot find game with id "${id}"`)
    }

    return this.transform(dto)
  }

  public async addGame(game: NewGameData, userId?: UserId): Promise<GameData> {
    const query = 'INSERT INTO games (user_id, name, type, scoring, weight, own) VALUES (?, ?, ?, ?, ?, ?)'
    const id = await this._dataService.insert(query, userId, game.name, game.type, game.scoring, game.weight, game.own ? 1 : 0)
    return { ...game, id: id.toString() as GameId }
  }
  
  public async updateGame(updatedGame: UpdatedGameData, userId?: UserId): Promise<GameData> {
    const mapping: Record<string, string> = {
      name: 'name',
      type: 'type',
      scoring: 'scoring',
      weight: 'weight',
      own: 'own'
    }

    const mappedKeys = Object.keys(updatedGame)
      .map(key => mapping[key])
      .filter(key => key !== undefined)
    const setStatements = mappedKeys
      .map(key => `${key} = ?`)
      .join(',')
    const updatedValues = mappedKeys.map(key => {
      const value = updatedGame[key as keyof UpdatedGameData]
      if (key === 'own') {
        return value ? 1 : 0
      }
      else {
        return value
      }
    })
      

    const query = `UPDATE games SET ${setStatements} WHERE id = ? AND ${whereUserId(userId)}`
    await this._dataService.run(query, ...updatedValues, updatedGame.id, userId)
    return this.getGame(updatedGame.id, userId)
  }

  private transform(game: DbGameDto): GameData {
    const data: GameData = {
      id: game.id.toString() as GameId,
      name: game.name,
      type: game.type as GameType,
      scoring: game.scoring as ScoringType,
      own: game.own === 1
    }

    if (game.weight !== undefined && game.weight !== null) {
      data.weight = game.weight
    }
  
    return data
  }

}