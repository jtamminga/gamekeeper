import { GameKeeperDeps } from '@core'
import { PlayerId } from '@services'
import { Player } from '@domains'


export type WinrateData = {
  playerId: PlayerId
  winrate: number
}


export class Winrate {

  public readonly player: Player
  public readonly winrate: number

  public constructor(
    data: WinrateData,
    deps: GameKeeperDeps
  ) {
    this.player = deps.store.getPlayer(data.playerId)
    this.winrate = data.winrate
  }
}