import { DbService } from './DbService'
import { NewPlayerData, PlayerData, PlayerId, PlayerService } from '@gamekeeper/core'



// types
export interface DbPlayerDto {
  id: number
  name: string
}


// service
export class DbPlayerService extends DbService implements PlayerService {

  public async addPlayer(player: NewPlayerData): Promise<PlayerData> {
    // save to database
    const query = 'INSERT INTO players (name) VALUES (?)'
    const id = await this._dataService.insert(query, player.name)
    
    return transform({ ...player, id })
  }

  public async getPlayers(): Promise<readonly PlayerData[]> {

    // query
    const query = 'SELECT * FROM players'

    // get data from db
    const dtos = await this._dataService.all<DbPlayerDto>(query)

    // return
    return dtos.map(dto => transform(dto))
  }

  public async updatePlayer(player: PlayerData): Promise<PlayerData> {
    const query = 'UPDATE players SET name = ? WHERE id = ?'
    await this._dataService.run(query, player.name, player.id)
    return player
  }
  
}


function transform(player: DbPlayerDto): PlayerData {
  return {
    id: player.id.toString() as PlayerId,
    name: player.name
  }
}
