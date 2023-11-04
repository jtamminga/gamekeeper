import type { GameDto } from './GameDto'
import type { GameData, GameId } from '@domains'


// repository
export interface GameService {

  getGames(): Promise<readonly GameDto[]>

  getGame(id: GameId): Promise<GameDto>

  addGame(game: GameData): Promise<GameDto>

}