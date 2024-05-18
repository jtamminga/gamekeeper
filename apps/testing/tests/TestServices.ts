import { v4 as uuidv4 } from 'uuid'
import { CoopPlaythroughData,
  GameDto,
  GameId,
  GameService,
  GameType,
  NewGameData,
  NewPlayerData,
  NotFoundError,
  PlayerDto,
  PlayerId,
  PlayerService,
  PlaythroughDto,
  PlaythroughId,
  PlaythroughQueryOptions,
  PlaythroughService,
  VsPlaythroughData
} from '@gamekeeper/core'


export type MemoryDatabase = {
  games: GameDto[]
  players: PlayerDto[]
  playthroughs: PlaythroughDto[]
}

export class TestGameService implements GameService {

  public constructor(private _db: MemoryDatabase) { }

  public async getGames(): Promise<readonly GameDto[]> {
    return this._db.games
  }

  public async getGame(id: GameId): Promise<GameDto> {
    const game = this._db.games.find(game => game.id === id)
    if (!game) {
      throw new Error(`game now found with id ${id}`)
    }
    return game
  }

  public async addGame(game: NewGameData): Promise<GameDto> {
    const dto: GameDto = {
      id: uuidv4() as GameId,
      ...game
    }
    this._db.games.push(dto)
    return dto
  }

}

export class TestPlayerService implements PlayerService {

  public constructor(private _db: MemoryDatabase) { }

  public async addPlayer(player: NewPlayerData): Promise<PlayerDto> {
    const dto: PlayerDto = {
      id: uuidv4() as PlayerId,
      ...player
    }
    this._db.players.push(dto)
    return dto
  }

  public async getPlayers(): Promise<readonly PlayerDto[]> {
    return this._db.players
  }
}

export class TestPlaythroughService implements PlaythroughService {

  public constructor(private _db: MemoryDatabase) { }

  public async getPlaythroughs(options?: PlaythroughQueryOptions | undefined): Promise<readonly PlaythroughDto[]> {
    if (options === undefined) {
      return this._db.playthroughs
    }

    let playthroughs = [...this._db.playthroughs]
    if (options.limit) {
      playthroughs = playthroughs.slice(0, options.limit)
    }
    if (options.gameId) {
      playthroughs = playthroughs.filter(p => p.gameId === options.gameId)
    }

    if (options.fromDate || options.toDate) {
      throw new Error('not implemented')
    }

    return playthroughs
  }

  public async addPlaythrough(playthrough: VsPlaythroughData | CoopPlaythroughData): Promise<PlaythroughDto> {
    const dto: PlaythroughDto = {
      id: playthrough.id ?? uuidv4() as PlaythroughId,
      gameId: playthrough.gameId,
      gameType: VsPlaythroughData.guard(playthrough) ? GameType.VS : GameType.COOP,
      playedOn: playthrough.playedOn,
      result: VsPlaythroughData.guard(playthrough) ? playthrough.winnerId : playthrough.playersWon,
      players: playthrough.playerIds,
      scores: VsPlaythroughData.guard(playthrough) ? playthrough.scores : playthrough.score
    }
    this._db.playthroughs.push(dto)
    return dto
  }

  public async getPlaythrough(id: PlaythroughId): Promise<PlaythroughDto> {
    const playthrough = this._db.playthroughs.find(p => p.id === id)
    if (!playthrough) {
      throw new NotFoundError(`playthrough "${id}" not found`)
    }
    return playthrough
  }

  public async removePlaythrough(id: PlaythroughId): Promise<void> {
    const index = this._db.playthroughs.findIndex(p => p.id === id)
    this._db.playthroughs.splice(index, 1)
  }

}