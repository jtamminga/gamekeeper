import type { GameData, GameId, GameService, GameType, NewGameData, ScoringType, UpdatedGameData } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { Route } from '@gamekeeper/views'


// types
interface ApiGameDto {
  id: string
  name: string
  type: number
  scoring: number
  weight?: number
}


// game service
export class ApiGameService extends ApiService implements GameService {

  public async getGames(): Promise<readonly GameData[]> {
    const games = await this.apiClient.get<ApiGameDto[]>(Route.GAMES)
    return games.map(this.transform)
  }

  public async getGame(id: GameId): Promise<GameData> {
    const game = await this.apiClient.get<ApiGameDto>(Route.forGame(id))
    return this.transform(game)
  }

  public async addGame(game: NewGameData): Promise<GameData> {
    const newGame = await this.apiClient.post<ApiGameDto>(Route.GAMES, game)
    return this.transform(newGame)
  }
  
  public async updateGame(updatedGame: UpdatedGameData): Promise<GameData> {
    const game = await this.apiClient.patch<ApiGameDto>(Route.forGame(updatedGame.id), updatedGame)
    return this.transform(game)
  }

  private transform(game: ApiGameDto): GameData {
    return {
      id: game.id as GameId,
      name: game.name,
      type: game.type as GameType,
      scoring: game.scoring as ScoringType,
      weight: game.weight
    }
  }

}