import type { PlayerId } from '@services'
import type { Player } from '@domains/gameplay'
import type { InsightsDeps } from '../Insights'


export type WinrateData = {
  playerId: PlayerId
  winrate: number
  plays: number
}


export class Winrate {

  public readonly player: Player
  public readonly winrate: number
  public readonly plays: number

  public constructor(
    data: WinrateData,
    deps: InsightsDeps
  ) {
    this.player = deps.gameplay.players.get(data.playerId)
    this.winrate = data.winrate
    this.plays = data.plays
  }
}