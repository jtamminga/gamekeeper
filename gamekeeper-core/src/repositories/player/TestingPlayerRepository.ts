import { NotFoundError } from '@core'
import { Player, PlayerId } from '@domains'
import { PlayerRepository } from './PlayerRespository'


// import test data
const playerData = [
  {
    id: '1',
    name: 'John'
  },
  {
    id: '2',
    name: 'Alex'
  }
]


// repository
export class TestingPlayerRepository implements PlayerRepository {
  
  private constructor(
    private _players: Player[]
  ) { }

  public static create(): TestingPlayerRepository {
    const players = playerData.map(data =>
      new Player({ id: data.id as PlayerId, name: data.name }))

    return new TestingPlayerRepository(players)
  }

  public async getPlayers(): Promise<ReadonlyArray<Player>> {
    return this._players
  }

  public async getPlayersMap(): Promise<ReadonlyMap<PlayerId, Player>> {
    throw new Error('Method not implemented.')
  }

  public async addPlayer(player: Player): Promise<void> {
    this._players.push(player)
  }

  public async getPlayer(id: PlayerId): Promise<Player> {
    const player = this._players.find(player => player.id === id)

    if (!player) {
      throw new NotFoundError(`player with id "${id}" not found`)
    }

    return player
  }

  public async findPlayers(ids: PlayerId[]): Promise<readonly Player[]> {
    return this._players.filter(player =>
      player.id !== undefined && ids.includes(player.id))
  }
}