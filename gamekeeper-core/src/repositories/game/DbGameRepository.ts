import { injectable } from 'tsyringe'
import { NotFoundError } from '@core'
import { Game, GameId, Playthrough } from '@domains'
import { GameFactory } from '@factories'
import { GameRepository } from './GameRepository'
import { DataService } from '@services'


// types
export interface GameDto {
  id: number
  name: string
  type: number
  scoring: number
}


// repository
@injectable()
export class DbGameRepository implements GameRepository {

  private _games: Map<GameId, Game>
  private _loadedAll: boolean

  public constructor(
    private _dataService: DataService
  ) {
    this._games = new Map()
    this._loadedAll = false
  }

  public async getGames(): Promise<readonly Game[]> {
    const games = await this.getMap()
    return Array.from(games.values())
  }

  public getGamesMap(): Promise<ReadonlyMap<GameId, Game<Playthrough>>> {
    return this.getMap()
  }

  public async addGame(game: Game): Promise<void> {
    const query = 'INSERT INTO games (name, type, scoring) VALUES (?, ?, ?)'
    const id = await this._dataService.insert(query, game.name, game.type, game.scoring)
    game.bindId(id.toString() as GameId)
    this._games.set(game.id!, game)
  }

  public async getGame<T extends Game>(id: GameId): Promise<T> {
    const games = await this.getGames()
    const game = games.find(game => game.id === id)
    if (!game) {
      throw new NotFoundError(`game with id "${id}" not found`)
    }
    return game as T
  }

  private async getMap(): Promise<ReadonlyMap<GameId, Game<Playthrough>>> {
    if (this._loadedAll) {
      return this._games
    }

    // get data from db
    const query = 'SELECT * FROM games'
    const dtos = await this._dataService.all<GameDto>(query)

    // create games
    for (const dto of dtos) {
      const game = dtoToGame(dto)
      this._games.set(game.id!, game)
    }

    this._loadedAll = true

    return this._games
  }

}


// helper
function dtoToGame(dto: GameDto, playthroughs?: readonly Playthrough[]): Game {
  return GameFactory.create({
    type: dto.type,
    id: dto.id.toString() as GameId,
    name: dto.name,
    scoring: dto.scoring,
    playthroughs
  })
}