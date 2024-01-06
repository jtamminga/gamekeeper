import type { PlayerData, PlayerDto, PlayerId, PlayerService } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { Route } from './Route'


// types
export interface ApiPlayerDto {
  id: string
  name: string
}


// player service
export class ApiPlayerService extends ApiService implements PlayerService {

  public async addPlayer(player: PlayerData): Promise<PlayerDto> {
    throw new Error('Method not implemented.')
  }

  public async getPlayers(): Promise<readonly PlayerDto[]> {
    const players = await this.apiClient.get<ApiPlayerDto[]>(Route.PLAYERS)
    return players.map(transform)
  }

}


// transform from api player to player dto
function transform(player: ApiPlayerDto): PlayerDto {
  return {
    id: player.id as PlayerId,
    name: player.name
  }
}