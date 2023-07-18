import { GameKeeperDeps } from '@core'
import { Player, PlayerData, PlayerId } from './Player'


// class
export class Players {

  public constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(): Promise<Players> {
    const dtos = await this._deps.service.playerService.getPlayers()
    this._deps.builder.bindPlayers(dtos)
    return this
  }

  public all(): ReadonlyArray<Player> {
    return Object.values(this._deps.builder.data.players)
  }

  public get(id: PlayerId): Player {
    const data = this._deps.builder.data
    return data.players[id]
  }

  public toData(): ReadonlyArray<PlayerData> {
    return this.all().map(player => player.toData())
  }

  public toMapData(): Readonly<Record<PlayerId, PlayerData>> {
    const data: Record<PlayerId, PlayerData> = { }
    for (const playerData of this.toData()) {
      data[playerData.id!] = playerData
    }
    return data
  }

}