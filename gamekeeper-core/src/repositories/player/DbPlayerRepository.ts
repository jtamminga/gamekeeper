import { ArrayUtils, NotFoundError } from '@core'
import { Player, PlayerId } from '@domains'
import { DataService } from '@services'
import { injectable } from 'tsyringe'
import { PlayerRepository } from './PlayerRespository'


// types
interface PlayerDto {
  id: number
  name: string
}


// repository
@injectable()
export class DbPlayerRepository implements PlayerRepository {

  private _players: Map<PlayerId, Player> | undefined

  public constructor(
    private _dataService: DataService
  ) { }

  public static create(dto: PlayerDto): Player {
    return new Player({ id: dto.id.toString() as PlayerId, name: dto.name })
  }

  public async getPlayers(): Promise<readonly Player[]> {
    const players = await this.getMap()
    return Array.from(players.values())
  }

  public async getPlayersMap(): Promise<ReadonlyMap<PlayerId, Player>> {
    return this.getMap()
  }

  public async addPlayer(player: Player): Promise<void> {
    // save to database
    const query = 'INSERT INTO players (name) VALUES (?)'
    const id = await this._dataService.insert(query, player.name)
    
    // update player
    const playerId = id.toString() as PlayerId
    player.bindId(playerId)
    
    // save in collection
    const players = await this.getMap()
    players.set(playerId, player)
  }

  public async getPlayer(id: PlayerId): Promise<Player> {
    const players = await this.getMap()
    const player = players.get(id)
    if (!player) {
      throw new NotFoundError(`player with id "${id}" not found`)
    }
    return player
  }

  public async findPlayers(ids: PlayerId[]): Promise<readonly Player[]> {
    const players = await this.getMap()
    
    return ids
      .map(id => players.get(id))
      .filter(ArrayUtils.notEmpty)
  }

  private async getMap(): Promise<Map<PlayerId, Player>> {
    if (this._players) {
      return this._players
    }

    // query
    const query = 'SELECT * FROM players'

    // get data from db
    const dtos = await this._dataService.all<PlayerDto>(query)

    // create players
    this._players = new Map<PlayerId, Player>()
    for (const dto of dtos) {
      const player = DbPlayerRepository.create(dto)
      this._players.set(player.id!, player)
    }

    return this._players
  }
  
}
