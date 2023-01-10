import { GameMap, GameRepository } from '@repos'
import { Playthrough } from 'domains/playthrough'
import { injectable } from 'tsyringe'
import { Game, GameId } from './Game'


// types
type AllOptions = {
  noPlaythroughs: boolean
}


// class
@injectable()
export class Games {

  public constructor(
    private _gameRepo: GameRepository
  ) { }

  public async all(): Promise<readonly Game[]> {
    return this._gameRepo.getGames()
  }

  public async asMap(): Promise<GameMap> {
    return this._gameRepo.getGamesMap()
  }

  public async get<T extends Game>(id: GameId): Promise<T> {
    return this._gameRepo.getGame<T>(id)
  }

  public async add(game: Game): Promise<void> {
    await this._gameRepo.addGame(game)
  }
}