import type { GameKeeperDeps, Serializable } from '@core'
import type { BasePlaythroughData, GameId, PlayerId, PlaythroughId } from '@services'
import type { Player } from '../player'
import type { Game } from '../game'
import { Entity } from '../Entity'


// class
export abstract class Playthrough
  extends Entity<PlaythroughId>
  implements Serializable<BasePlaythroughData> {

  public readonly playerIds: ReadonlyArray<PlayerId>
  public readonly gameId: GameId
  public readonly playedOn: Date

  public constructor(protected _deps: GameKeeperDeps, data: BasePlaythroughData) {
    super(data.id)
    this.gameId = data.gameId
    this.playerIds = data.playerIds
    this.playedOn = data.playedOn
  }

  public get game(): Game {
    return this._deps.store.getGame(this.gameId)
  }

  public get players(): ReadonlyArray<Player> {
    return this._deps.store.getPlayers(this.playerIds)
  }

  public toData(): BasePlaythroughData {
    return {
      id: this.id,
      gameId: this.gameId,
      playedOn: this.playedOn,
      playerIds: this.playerIds
    }
  }

}