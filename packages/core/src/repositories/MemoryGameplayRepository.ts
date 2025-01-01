import { Game, GameFactory, Player, PlayerFactory, Playthrough, PlaythroughFactory } from '@domains/gameplay'
import { GameplayRepository } from './GameplayRepository'
import { NotFoundError } from '@core'
import {
  PlayerId,
  NewPlayerData,
  Services,
  GameId,
  PlaythroughId,
  PlayerData,
  GameData,
  NewGameData,
  PlaythroughData,
  PlaythroughQueryOptions,
  NewPlaythroughData,
  Logger
} from '@services'


export class MemoryGameplayRepository implements GameplayRepository {

  private _players: Map<PlayerId, Player>
  private _games: Map<GameId, Game>
  private _playthroughs: Map<PlaythroughId, Playthrough>

  public constructor(private _services: Services, private _logger: Logger) {
    this._players = new Map<PlayerId, Player>()
    this._games = new Map<GameId, Game>()
    this._playthroughs = new Map<PlaythroughId, Playthrough>()
  }


  //
  // players
  // =======


  public get players(): ReadonlyArray<Player> {
    return Array.from(this._players, ([_, player]) => player)
  }

  public async hydratePlayers(): Promise<ReadonlyArray<Player>> {
    const playersData = await this._services.playerService.getPlayers()
    return playersData.map(data => this.bindPlayer(data))
  }
  
  public getPlayer(id: PlayerId): Player {
    const player = this._players.get(id)
    if (!player) {
      throw new NotFoundError(`could not find player with id ${id}`)
    }
    return player
  }

  public getPlayers(ids: ReadonlyArray<PlayerId>): ReadonlyArray<Player> {
    return ids.map(id => this.getPlayer(id))
  }

  public async createPlayer(data: NewPlayerData): Promise<Player> {
    const playerData = await this._services.playerService.addPlayer(data)
    return this.bindPlayer(playerData)
  }

  public async updatePlayer(player: Player): Promise<void> {
    await this._services.playerService.updatePlayer(player.toData())
  }

  private bindPlayer(data: PlayerData): Player {
    let player = this._players.get(data.id)
    if (player) {
      return player
    }

    player = PlayerFactory.create({ logger: this._logger, repo: this }, data)
    this._players.set(data.id, player)
    return player
  }


  //
  // games
  // =====


  public get games(): ReadonlyArray<Game> {
    return Array
      .from(this._games, ([_, game]) => game)
      .sort(gameSortByName)
  }

  public async hydrateGames(): Promise<ReadonlyArray<Game>> {
    const gamesData = await this._services.gameService.getGames()
    return gamesData.map(data => this.bindGame(data))
  }

  public getGame(id: GameId): Game {
    const game = this._games.get(id)
    if (!game) {
      throw new NotFoundError(`could not find game with id ${id}`)
    }
    return game
  }

  public async createGame(data: NewGameData): Promise<Game> {
    const gameData = await this._services.gameService.addGame(data)
    return this.bindGame(gameData)
  }

  public async updateGame(game: Game): Promise<void> {
    await this._services.gameService.updateGame(game.toData())
  }

  private bindGame(data: GameData): Game {
    let game = this._games.get(data.id)
    if (game) {
      return game
    }

    game = GameFactory.create({ logger: this._logger, repo: this }, data)
    this._games.set(data.id, game)
    return game
  }


  //
  // playthroughs
  // ============


  public get playthroughs(): ReadonlyArray<Playthrough> {
    return Array
      .from(this._playthroughs, ([_, playthrough]) => playthrough)
      .sort(playthroughSortLastPlayedFirst)
  }

  public async hydratePlaythroughs(options?: PlaythroughQueryOptions): Promise<ReadonlyArray<Playthrough>> {
    const playthroughData = await this._services.playthroughService.getPlaythroughs(options)
    return playthroughData.map(data => this.bindPlaythrough(data))
  }

  public async createPlaythrough<T extends Playthrough = Playthrough>(data: NewPlaythroughData): Promise<T> {
    const playthroughData = await this._services.playthroughService.addPlaythrough(data)
    return this.bindPlaythrough(playthroughData) as T
  }

  public async removePlaythrough(id: PlaythroughId): Promise<void> {
    await this._services.playthroughService.removePlaythrough(id)
    this._playthroughs.delete(id)
  }

  public getPlaythrough(id: PlaythroughId): Playthrough {
    const playthrough = this._playthroughs.get(id)
    if (!playthrough) {
      throw new NotFoundError(`could not find playthrough with id ${id}`)
    }
    return playthrough
  }

  public getPlaythroughs(options?: PlaythroughQueryOptions): ReadonlyArray<Playthrough> {
    let playthroughs: Playthrough[] = [...this.playthroughs] // already sorted
    
    if (options?.gameId !== undefined) {
      playthroughs = playthroughs.filter(p => p.gameId === options.gameId)
    }
    if (options?.fromDate !== undefined) {
      const fromDateEpoch = options.fromDate.getTime()
      playthroughs = playthroughs.filter(p => p.playedOn.getTime() >= fromDateEpoch)
    }
    if (options?.toDate !== undefined) {
      const toDateEpoch = options.toDate.getTime()
      playthroughs = playthroughs.filter(p => p.playedOn.getTime() <= toDateEpoch)
    }
    if (options?.limit !== undefined) {
      playthroughs = playthroughs.slice(0, options.limit)
    }
    
    return playthroughs
  }

  private bindPlaythrough(data: PlaythroughData): Playthrough {
    let playthrough = this._playthroughs.get(data.id)
    if (playthrough) {
      return playthrough
    }

    playthrough = PlaythroughFactory.create({ logger: this._logger, repo: this }, data)
    this._playthroughs.set(data.id, playthrough)
    return playthrough
  }
  
}


//
// sorting utils
// =============


function gameSortByName(a: Game, b: Game): number {
  const aName = a.name.toUpperCase()
  const bName = b.name.toUpperCase()

  if (aName < bName) {
    return -1
  }
  else if (aName > bName) {
    return 1
  }
  else {
    return 0
  }
}

function playthroughSortLastPlayedFirst(a: Playthrough, b: Playthrough): number {
  return b.playedOn.getTime() - a.playedOn.getTime()
}