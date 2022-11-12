import { NotFoundError } from '@core'
import { CoopGame, Game, GameId, Playthrough, VsGame } from '@domains'
import { GameRepository } from './GameRepository'


// import test data
const gameData = {} as any[]


// repository
export class TestingGameRepository implements GameRepository {

  private _games: Game[]

  private constructor() {
    this._games = gameData.map(data => gameFactory(data))
  }

  public async getGames(): Promise<ReadonlyArray<Game>> {
    return this._games
  }

  public getGamesMap(): Promise<ReadonlyMap<GameId, Game<Playthrough>>> {
    throw new Error('Method not implemented.')
  }

  public async addGame(game: Game): Promise<void> {
    this._games.push(game)
  }

  public async getGame<T extends Game>(id: GameId): Promise<T> {
    const game = this._games.find(game => game.id === id)
    if (!game) {
      throw new NotFoundError(`game with id "${id}" not found`)
    }
    return game as T
  }
}


// helper
function gameFactory(data: typeof gameData[0]): Game {
  const {id, type, name, scoring} = data

  if (data.type === 'vs') {
    return new VsGame({ id: id as GameId, name, scoring })
  }

  if (type === 'coop') {
    return new CoopGame({ id: id as GameId, name, scoring })
  }

  throw new Error('game type not supported')
}