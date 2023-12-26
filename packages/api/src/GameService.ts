import { GameData, GameDto, GameId, GameService } from '@gamekeeper/core'
import { ApiService } from 'ApiService'
import { Route } from 'Route'


// game service
export class ApiGameService extends ApiService implements GameService {

  public async getGames(): Promise<readonly GameDto[]> {
    return this.apiClient.get(Route.GAMES)
  }

  public async getGame(id: GameId): Promise<GameDto> {
    return this.apiClient.get(Route.forGame(id))
  }

  public async addGame(game: GameData): Promise<GameDto> {
    throw new Error('Method not implemented.')
  }

}