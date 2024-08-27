import { GameKeeperDeps, NotFoundError } from '@core'
import { GameFactory, PlayerFactory, PlaythroughFactory } from '@factories'
import { GameDto, GameId, GoalId, Logger, PlayerDto, PlayerId, PlaythroughData, PlaythroughId, Services } from '@services'
import { Game } from './game'
import { Playthrough } from './playthrough'
import { Player } from './player'
import { Goal } from './goal'


// type
type Records = {
  games: Map<GameId, Game>
  playthroughs: Map<PlaythroughId, Playthrough>
  players: Map<PlayerId, Player>
  goals: Map<GoalId, Goal>
}


// builder
export class Store {

  private _data: Records

  public constructor(
    private _services: Services,
    private _logger: Logger
  ) {
    this._data = {
      games: new Map(),
      playthroughs: new Map(),
      players: new Map(),
      goals: new Map()
    }
  }

  public get games(): ReadonlyArray<Game> {
    return Array.from(this._data.games, ([_, game]) => game)
  }

  public get players(): ReadonlyArray<Player> {
    return Array.from(this._data.players, ([_, player]) => player)
  }

  public get playthroughs(): ReadonlyArray<Playthrough> {
    return Array.from(this._data.playthroughs, ([_, playthrough]) => playthrough)
  }

  public get goals(): ReadonlyArray<Goal> {
    return Array.from(this._data.goals, ([_, goal]) => goal)
  }

  private get deps(): GameKeeperDeps {
    return {
      services: this._services,
      store: this,
      logger: this._logger
    }
  }

  public bindGame(dto: GameDto): Game {
    const { games } = this._data

    let game = games.get(dto.id)
    if (game) {
      return game
    }

    game = GameFactory.create(this.deps, dto)
    games.set(dto.id, game)
    return game
  }

  public bindGames(dtos: ReadonlyArray<GameDto>): void {
    dtos.forEach(dto => this.bindGame(dto))
  }

  public bindPlayer(dto: PlayerDto): Player {
    const { players } = this._data

    let player = players.get(dto.id)
    if (player) {
      return player
    }

    player = PlayerFactory.create(dto)
    players.set(dto.id, player)
    return player
  }

  public bindPlayers(dtos: ReadonlyArray<PlayerDto>): void {
    dtos.forEach(dto => this.bindPlayer(dto))
  }

  public bindPlaythrough(data: PlaythroughData): Playthrough {
    const { playthroughs } = this._data

    let playthrough = playthroughs.get(data.id)
    if (playthrough) {
      return playthrough
    }

    playthrough = PlaythroughFactory.create(this.deps, data)
    playthroughs.set(data.id, playthrough)
    return playthrough
  }

  public bindPlaythroughs(dtos: ReadonlyArray<PlaythroughData>): void {
    dtos.forEach(dto => this.bindPlaythrough(dto))
  }

  public getGame(id: GameId): Game {
    const game = this._data.games.get(id)
    if (!game) {
      throw new NotFoundError(`could not find game with id ${id}`)
    }
    return game
  }

  public getPlayer(id: PlayerId): Player {
    const player = this._data.players.get(id)
    if (!player) {
      throw new NotFoundError(`could not find player with id ${id}`)
    }
    return player
  }

  public getPlayers(ids: ReadonlyArray<PlayerId>): ReadonlyArray<Player> {
    return ids.map(id => this.getPlayer(id))
  }

  public getPlaythrough(id: PlaythroughId): Playthrough | undefined {
    return this._data.playthroughs.get(id)
  }

  public removePlaythrough(id: PlaythroughId): void {
    this._data.playthroughs.delete(id)
  }

}