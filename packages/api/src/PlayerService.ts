import type { NewPlayerData, PlayerData, PlayerId, PlayerService } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { Route } from '@gamekeeper/views'


// types
export interface ApiPlayerDto {
  id: string
  name: string
}


// player service
export class ApiPlayerService extends ApiService implements PlayerService {

  public async addPlayer(data: NewPlayerData): Promise<PlayerData> {
    const newPlayer = await this.apiClient.post<ApiPlayerDto>(Route.PLAYERS, data)
    return transform(newPlayer)
  }

  public async getPlayers(): Promise<readonly PlayerData[]> {
    const players = await this.apiClient.get<ApiPlayerDto[]>(Route.PLAYERS)
    return players.map(transform)
  }

}


// transform from api player to player dto
function transform(player: ApiPlayerDto): PlayerData {
  return {
    id: player.id as PlayerId,
    name: player.name
  }
}