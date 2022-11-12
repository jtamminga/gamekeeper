import { GameRepository, PlaythroughRepository } from '@repos'
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
    private _gameRepo: GameRepository,
    private _playthroughRepo: PlaythroughRepository 
  ) { }

  public async all(): Promise<readonly Game[]> {
    const [games, playthroughs] = await Promise.all([
      this._gameRepo.getGames(),
      this._playthroughRepo.getPlaythroughs()
    ])

    for (const game of games) {
      game.bindPlaythroughs(
        playthroughs.filter(p => p.gameId === game.id)
      )
    }

    return games
  }

  public async asMap(): Promise<ReadonlyMap<GameId, Game>> {
    return this._gameRepo.getGamesMap()
  }

  public async get<T extends Game>(id: GameId): Promise<T> {
    return this._gameRepo.getGame<T>(id)
  }

  public async add(game: Game): Promise<void> {
    await this._gameRepo.addGame(game)
  }
}