import { injectable } from 'tsyringe'
import { NotFoundError } from '@core'
import { Game, GameId, Playthrough } from '@domains'
import { GameFactory } from '@factories'
import { GameRepository } from './GameRepository'
import { DbRepo } from '../DbRepo'


// types
export interface GameDto {
  id: number
  name: string
  type: number
  scoring: number
}


// repository
@injectable()
export class DbGameRepository extends DbRepo implements GameRepository {

  private _games: Game[]
  private _loadedAll: boolean

  public constructor() {
    super()
    this._games = []
    this._loadedAll = false
  }

  // factory
  public static create(dto: GameDto, playthroughs?: readonly Playthrough[]): Game {
    return GameFactory.create({
      type: dto.type,
      id: dto.id.toString() as GameId,
      name: dto.name,
      scoring: dto.scoring,
      playthroughs
    })
  }

  public async getGames(): Promise<readonly Game[]> {
    if (this._loadedAll) {
      return this._games
    }

    // get data from db
    const query = 'SELECT * FROM games'
    const dtos = await this._dataService.all<GameDto>(query)

    // create games
    this._games = dtos.map(dto =>
      DbGameRepository.create(dto))

    this._loadedAll = true

    return this._games
  }

  public async addGame(game: Game): Promise<void> {
    const query = 'INSERT INTO games (name, type, scoring) VALUES (?, ?, ?)'
    const id = await this._dataService.insert(query, game.name, game.type, game.scoring)
    game.setId(id.toString() as GameId)
    this._games.push(game)
  }

  public async getGame<T extends Game>(id: GameId): Promise<T> {
    const games = await this.getGames()
    const game = games.find(game => game.id === id)
    if (!game) {
      throw new NotFoundError(`game with id "${id}" not found`)
    }
    return game as T
  }

}