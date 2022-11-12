import { Game, GameId } from 'domains'


export interface GameRepository {
  getGames(): Promise<readonly Game[]>
  getGamesMap(): Promise<ReadonlyMap<GameId, Game>>
  addGame(game: Game): Promise<void>
  getGame<T extends Game>(id: GameId): Promise<T>
}