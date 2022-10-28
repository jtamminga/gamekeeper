import { GameRepository, PlaythroughRepository } from '@repos'
import { container } from 'tsyringe'
import { Game, GameId } from './Game'


// class
export class Games {

  private _gameRepo: GameRepository
  private _playthroughRepo: PlaythroughRepository 

  public constructor() {
    this._gameRepo = container.resolve('GameRepository')
    this._playthroughRepo = container.resolve('PlaythroughRepository')
  }

  public async all(): Promise<readonly Game[]> {
    const games = await this._gameRepo.getGames()
    const playthroughs = await this._playthroughRepo.getPlaythroughs()

    for (const game of games) {
      game.playthroughs.push(
        ...playthroughs.filter(p => p.gameId === game.id)
      )
    }

    return games
  }

  public async get<T extends Game>(id: GameId): Promise<T> {
    return this._gameRepo.getGame<T>(id)
  }

  public async add(game: Game): Promise<void> {
    await this._gameRepo.addGame(game)
  }
}