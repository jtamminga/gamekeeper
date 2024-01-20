import type { GameDto, GameId, GameService, GameType, NewGameData, ScoringType } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { Route } from '@gamekeeper/core'


// types
interface ApiGameDto {
  id: string
  name: string
  type: number
  scoring: number
}


// game service
export class ApiGameService extends ApiService implements GameService {

  public async getGames(): Promise<readonly GameDto[]> {
    const games = await this.apiClient.get<ApiGameDto[]>(Route.GAMES)
    return games.map(transform)
  }

  public async getGame(id: GameId): Promise<GameDto> {
    const game = await this.apiClient.get<ApiGameDto>(Route.forGame(id))
    return transform(game)
  }

  public async addGame(game: NewGameData): Promise<GameDto> {
    const newGame = await this.apiClient.post<ApiGameDto>(Route.GAMES, game)
    return transform(newGame)
  }

}


// transform api game to game dto
function transform(game: ApiGameDto): GameDto {
  return {
    id: game.id as GameId,
    name: game.name,
    type: game.type as GameType,
    scoring: game.scoring as ScoringType
  }
}