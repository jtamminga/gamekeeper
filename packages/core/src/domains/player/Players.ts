import type { GameKeeperDeps } from '@core'
import type { Player, PlayerData } from './Player'
import type { PlayerId } from '@services'


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

  public toData(): ReadonlyArray<PlayerData> {
    return this.all().map(player => player.toData())
  }

}