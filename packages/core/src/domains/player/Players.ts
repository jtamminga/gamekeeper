import type { GameKeeperDeps } from '@core'
import type { Player } from './Player'
import type { NewPlayerData, PlayerData, PlayerId } from '@services'


// class
export class Players {

  public constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(): Promise<Players> {
    const dtos = await this._deps.services.playerService.getPlayers()
    this._deps.logger.info(`players hydrated: ${dtos.length} records`)
    this._deps.store.bindPlayers(dtos)
    return this
  }

  public all(): ReadonlyArray<Player> {
    return this._deps.store.players
  }

  public get(id: PlayerId): Player {
    return this._deps.store.getPlayer(id)
  }

  public async create(data: NewPlayerData): Promise<Player> {
    const dto = await this._deps.services.playerService.addPlayer(data)
    return this._deps.store.bindPlayer(dto)
  }

  public toData(): ReadonlyArray<PlayerData> {
    return this.all().map(player => player.toData())
  }

}