import type { GameDto, GameId } from './GameDto'
import type { NewGameData, UpdatedGameData } from '@domains'


// repository
export interface GameService {

  getGames(): Promise<readonly GameDto[]>

  getGame(id: GameId): Promise<GameDto>

  addGame(game: NewGameData): Promise<GameDto>

  updateGame(updatedGame: UpdatedGameData): Promise<GameDto>

}