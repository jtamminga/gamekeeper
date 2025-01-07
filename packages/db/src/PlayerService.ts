import { DbService } from './DbService'
import { NewPlayerData, NotFoundError, PlayerData, PlayerId, PlayerService, UpdatedPlayerData } from '@gamekeeper/core'
import { UserId, whereUserId } from './User'



// types
export interface DbPlayerDto {
  id: number
  name: string
}


// service
export class DbPlayerService extends DbService implements PlayerService {

  public async addPlayer(player: NewPlayerData, userId?: UserId): Promise<PlayerData> {
    // save to database
    const query = 'INSERT INTO players (name, user_id) VALUES (?, ?)'
    const id = await this._dataService.insert(query, player.name, userId)
    
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
    const query = `UPDATE players SET name = ? WHERE id = ? AND ${whereUserId(userId)}`
    await this._dataService.run(query, player.name, player.id, userId)
    return this.getPlayer(player.id, userId)
  }

  private transform(player: DbPlayerDto): PlayerData {
    return {
      id: player.id.toString() as PlayerId,
      name: player.name
    }
  }
  
}