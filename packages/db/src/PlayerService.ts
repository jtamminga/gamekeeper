import { Player, PlayerId } from '@domains'
import { DataService } from '@services'


// types
export interface PlayerDto {
  id: number
  name: string
}


// service
export class PlayerService {

  public constructor(
    private _dataService: DataService
  ) { }

  public async addPlayer(player: Player): Promise<void> {
    // save to database
    const query = 'INSERT INTO players (name) VALUES (?)'
    const id = await this._dataService.insert(query, player.name)
    
    // update player
    const playerId = id.toString() as PlayerId
    player.bindId(playerId)
  }

  public async getPlayers(): Promise<readonly PlayerDto[]> {

    // query
    const query = 'SELECT * FROM players'

    // get data from db
    const dtos = await this._dataService.all<PlayerDto>(query)

    // return
    return dtos
  }
  
}
