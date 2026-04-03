import {
  CoopPlaythroughData,
  GameData,
  GameId,
  GameService,
  GoalData,
  GoalId,
  GoalService,
  GoalsQuery,
  NewGameData,
  NewGoalData,
  NewPlayerData,
  NotFoundError,
  PlayerData,
  PlayerId,
  PlayerService,
  PlaythroughData,
  PlaythroughId,
  PlaythroughQueryOptions,
  PlaythroughService,
  UpdatedGameData,
  UpdatedGoalData,
  UpdatedPlayerData,
  UpdatedPlaythroughData,
  VsPlaythroughData
} from '@gamekeeper/core'
import { v4 as uuidv4 } from 'uuid'


export type MemoryDatabase = {
  games: GameData[]
  players: PlayerData[]
  playthroughs: PlaythroughData[]
}

export class TestGameService implements GameService {

  public constructor(private _db: MemoryDatabase) { }

  public async getGames(): Promise<readonly GameData[]> {
    return this._db.games
  }

  public async getGame(id: GameId): Promise<GameData> {
    const game = this._db.games.find(game => game.id === id)
    if (!game) {
      throw new Error(`game now found with id ${id}`)
    }
    return game
  }

  public async addGame(game: NewGameData): Promise<GameData> {
    const dto: GameData = {
      id: uuidv4() as GameId,
      ...game
    }
    this._db.games.push(dto)
    return dto
  }

  public async updateGame(updatedGame: UpdatedGameData): Promise<GameData> {
    throw new Error('Method not implemented.')
  }

}

export class TestPlayerService implements PlayerService {

  public constructor(private _db: MemoryDatabase) { }

  public async addPlayer(player: NewPlayerData): Promise<PlayerData> {
    const dto: PlayerData = {
      id: uuidv4() as PlayerId,
      ...player
    }
    this._db.players.push(dto)
    return dto
  }

  public async getPlayers(): Promise<readonly PlayerData[]> {
    return this._db.players
  }

  public async updatePlayer(player: UpdatedPlayerData): Promise<PlayerData> {
    throw new Error('Method not implemented.')
  }
}

export class TestPlaythroughService implements PlaythroughService {

  public constructor(private _db: MemoryDatabase) { }

  public async getPlaythroughs(options?: PlaythroughQueryOptions | undefined): Promise<readonly PlaythroughData[]> {
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

  public async addPlaythrough(playthrough: VsPlaythroughData | CoopPlaythroughData): Promise<PlaythroughData> {
    this._db.playthroughs.push(playthrough)
    return playthrough
  }

  public async getPlaythrough(id: PlaythroughId): Promise<PlaythroughData> {
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

  public async updatePlaythrough(playthrough: UpdatedPlaythroughData): Promise<PlaythroughData> {
    throw new Error('Method not implemented.')
  }

}

export class TestGoalService implements GoalService {

  public addGoal(goal: NewGoalData): Promise<GoalData> {
    throw new Error('Method not implemented.')
  }

  public getGoal(id: GoalId): Promise<GoalData> {
    throw new Error('Method not implemented.')
  }

  public getGoals(query?: GoalsQuery): Promise<readonly GoalData[]> {
    throw new Error('Method not implemented.')
  }

  public updateGoal(goal: UpdatedGoalData): Promise<GoalData> {
    throw new Error('Method not implemented.')
  }

  public removeGoal(id: GoalId): Promise<void> {
    throw new Error('Method not implemented.')
  }
  
}