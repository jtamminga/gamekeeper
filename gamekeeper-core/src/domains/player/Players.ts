import { GameKeeperDeps } from '@core'
import { Player, PlayerId } from './Player'


// class
export class Players {

  public constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(): Promise<void> {
    const dtos = await this._deps.service.playerService.getPlayers()
    this._deps.builder.bindPlayers(dtos)
  }

  public all(): ReadonlyArray<Player> {
    return Object.values(this._deps.builder.data.players)
  }

  public get(id: PlayerId): Player {
    const data = this._deps.builder.data
    return data.players[id]
  }

}