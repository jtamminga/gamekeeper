import { PlayerData, PlayerDto, PlayerService } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { Route } from './Route'


// player service
export class ApiPlayerService extends ApiService implements PlayerService {

  public async addPlayer(player: PlayerData): Promise<PlayerDto> {
    throw new Error('Method not implemented.')
  }

  public async getPlayers(): Promise<readonly PlayerDto[]> {
    return this.apiClient.get(Route.PLAYERS)
  }

}