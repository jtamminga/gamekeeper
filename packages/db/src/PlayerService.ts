import { DbService } from './DbService'
import { NewPlayerData, NotFoundError, PlayerData, PlayerId, PlayerService, UpdatedPlayerData } from '@gamekeeper/core'
import { UserId, whereUserId } from './User'



// types
export interface DbPlayerDto {
  id: number
  name: string
  color?: number
}


// service
export class DbPlayerService extends DbService implements PlayerService {

  public async addPlayer(player: NewPlayerData, userId?: UserId): Promise<PlayerData> {
    // save to database
    const query = 'INSERT INTO players (name, color, user_id) VALUES (?, ?)'
    const id = await this._dataService.insert(query, player.name, player.color, userId)
    
    return this.transform({ ...player, id })
  }

  public async getPlayer(id: PlayerId, userId?: UserId): Promise<PlayerData> {
    const query = `SELECT * FROM players WHERE id = ? AND ${whereUserId(userId)}`
    const dto = await this._dataService.get<DbPlayerDto>(query, id, userId)
    if (dto === undefined) {
      throw new NotFoundError(`cannot find player with id "${id}"`)
    }

    return this.transform(dto)
  }

  public async getPlayers(userId?: UserId): Promise<readonly PlayerData[]> {
    const query = `SELECT * FROM players WHERE ${whereUserId(userId)}`
    const dtos = await this._dataService.all<DbPlayerDto>(query, userId)
    return dtos.map(dto => this.transform(dto))
  }

  public async updatePlayer(player: UpdatedPlayerData, userId?: UserId): Promise<PlayerData> {
    const mapping: Record<string, string> = {
      name: 'name',
      color: 'color'
    }

    const mappedKeys = Object.keys(player)
      .map(key => mapping[key])
      .filter(key => key !== undefined)
    const setStatements = mappedKeys
      .map(key => `${key} = ?`)
      .join(',')
    const updatedValues = mappedKeys.map(key =>
      player[key as keyof UpdatedPlayerData])

    const query = `UPDATE players SET ${setStatements} WHERE id = ? AND ${whereUserId(userId)}`
    await this._dataService.run(query, ...updatedValues, player.id, userId)
    return this.getPlayer(player.id, userId)
  }

  private transform(player: DbPlayerDto): PlayerData {
    const data: PlayerData = {
      id: player.id.toString() as PlayerId,
      name: player.name
    }

    if (player.color !== undefined) {
      data.color = player.color
    }

    return data
  }
  
}