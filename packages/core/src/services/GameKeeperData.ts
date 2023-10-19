import { GameKeeperDeps } from '@core'
import { Game, GameId, GameKeeper, Player, PlayerId, Playthrough, PlaythroughId } from '@domains'
import { GameFactory, PlayerFactory, PlaythroughFactory } from '@factories'
import { GameDto } from './game'
import { GameKeeperService } from './GameKeeperService'
import { PlayerDto } from './player'
import { PlaythroughDto } from './playthrough'


// type
export type GameKeeperData = {
  games: Record<GameId, Game>
  playthroughs: Record<PlaythroughId, Playthrough>
  players: Record<PlayerId, Player>
}


// builder
export class DataBuilder {

  private _data: GameKeeperData

  public constructor(private _service: GameKeeperService) {
    this._data = {
      games: {},
      playthroughs: {},
      players: {}
    }
  }

  public createGameKeeper(): GameKeeper {
    return new GameKeeper(this.deps)
  }

  private get deps(): GameKeeperDeps {
    return {
      service: this._service,
      builder: this
    }
  }

  public get data(): Readonly<GameKeeperData> {
    return this._data
  }

  public bindGame(dto: GameDto): DataBuilder {
    const id = dto.id.toString() as GameId
    if (this._data.games[id]) {
      return this
    }
    this._data.games[id] = GameFactory.create(this.deps, dto)

    return this
  }

  public bindGames(dtos: ReadonlyArray<GameDto>): DataBuilder {
    dtos.forEach(dto => this.bindGame(dto))
    return this
  }

  public bindPlayer(dto: PlayerDto): DataBuilder {
    const id = dto.id.toString() as PlayerId
    if (this._data.players[id]) {
      return this
    }
    this._data.players[id] = PlayerFactory.create(dto)
    return this
  }

  public bindPlayers(dtos: ReadonlyArray<PlayerDto>): DataBuilder {
    dtos.forEach(dto => this.bindPlayer(dto))
    return this
  }

  public bindPlaythrough(dto: PlaythroughDto): DataBuilder {
    const id = dto.id.toString() as PlaythroughId
    if (this._data.playthroughs[id]) {
      return this
    }
    this._data.playthroughs[id] = PlaythroughFactory.create(this.deps, dto)

    return this
  }

  public bindPlaythroughs(dtos: ReadonlyArray<PlaythroughDto>): DataBuilder {
    dtos.forEach(dto => this.bindPlaythrough(dto))
    return this
  }
}