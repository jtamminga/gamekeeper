import { v4 as uuidv4 } from 'uuid'
import { CoopPlaythroughData,
  ExternalServices,
  GameData,
  GameDto,
  GameId,
  GameService,
  GameType,
  PlayerData,
  PlayerDto,
  PlayerId,
  PlayerService,
  PlaythroughDto,
  PlaythroughId,
  PlaythroughQueryOptions,
  PlaythroughService,
  VsPlaythroughData
} from 'core'


type MemoryDatabase = {
  games: GameDto[]
  players: PlayerDto[]
  playthroughs: PlaythroughDto[]
}


class TestGameService implements GameService {

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

  public async addGame(game: GameData): Promise<GameDto> {
    const dto: GameDto = {
      id: game.id ?? uuidv4() as GameId,
      ...game
    }
    this._db.games.push(dto)
    return dto
  }

}

class TestPlayerService implements PlayerService {

  public constructor(private _db: MemoryDatabase) { }

  public async addPlayer(player: PlayerData): Promise<PlayerDto> {
    const dto: PlayerDto = {
      id: player.id ?? uuidv4() as PlayerId,
      ...player
    }
    this._db.players.push(dto)
    return dto
  }

  public async getPlayers(): Promise<readonly PlayerDto[]> {
    return [
      {
        id: '1' as PlayerId,
        name: 'john'
      },
      {
        id: '2' as PlayerId,
        name: 'alex'
      }
    ]
  }
}

class TestPlaythroughService implements PlaythroughService {

  public constructor(private _db: MemoryDatabase) { }

  public async getPlaythroughs(options?: PlaythroughQueryOptions | undefined): Promise<readonly PlaythroughDto[]> {
    return this._db.playthroughs
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

}


export function createTestServices(): ExternalServices {
  const db: MemoryDatabase = {
    games: [],
    players: [],
    playthroughs: []
  }

  return {
    gameService: new TestGameService(db),
    playerService: new TestPlayerService(db),
    playthroughService: new TestPlaythroughService(db)
  }
}