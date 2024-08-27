import type { GameData, GameId, NewGameData, UpdatedGameData } from './GameData'


// repository
export interface GameService {

  getGames(): Promise<readonly GameData[]>

  getGame(id: GameId): Promise<GameData>

  addGame(game: NewGameData): Promise<GameData>

  updateGame(updatedGame: UpdatedGameData): Promise<GameData>

}