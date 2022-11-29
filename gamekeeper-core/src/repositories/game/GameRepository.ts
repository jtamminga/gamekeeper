import { Game, GameId } from 'domains'


// type
export type GameMap = ReadonlyMap<GameId, Game>


// repo
export interface GameRepository {
  getGames(): Promise<readonly Game[]>
  getGamesMap(): Promise<GameMap>
  addGame(game: Game): Promise<void>
  getGame<T extends Game>(id: GameId): Promise<T>
}