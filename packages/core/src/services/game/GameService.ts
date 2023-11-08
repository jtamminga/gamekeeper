import type { GameDto, GameId } from './GameDto'
import type { GameData } from '@domains'


// repository
export interface GameService {

  getGames(): Promise<readonly GameDto[]>

  getGame(id: GameId): Promise<GameDto>

  addGame(game: GameData): Promise<GameDto>

}