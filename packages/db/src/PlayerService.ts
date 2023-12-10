import type { DataService } from './DataService'
import { PlayerData, PlayerDto, PlayerId, PlayerService } from '@gamekeeper/core'



// types
export interface DbPlayerDto {
  id: number
  name: string
}


// service
export class DbPlayerService implements PlayerService {

  public constructor(
    private _dataService: DataService
  ) { }

  public async addPlayer(player: PlayerData): Promise<PlayerDto> {
    // save to database
    const query = 'INSERT INTO players (name) VALUES (?)'
    const id = await this._dataService.insert(query, player.name)
    
    return transform({ ...player, id })
  }

  public async getPlayers(): Promise<readonly PlayerDto[]> {

    // query
    const query = 'SELECT * FROM players'

    // get data from db
    const dtos = await this._dataService.all<DbPlayerDto>(query)

    // return
    return dtos.map(dto => transform(dto))
  }
  
}


function transform(player: DbPlayerDto): PlayerDto {
  return {
    id: player.id.toString() as PlayerId,
    name: player.name
  }
}
