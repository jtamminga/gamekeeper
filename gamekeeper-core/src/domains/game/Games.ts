import { GameRepository, PlaythroughRepository } from '@repos'
import { injectable } from 'tsyringe'
import { Game, GameId } from './Game'


// class
@injectable()
export class Games {

  public constructor(
    private _gameRepo: GameRepository,
    private _playthroughRepo: PlaythroughRepository 
  ) { }

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