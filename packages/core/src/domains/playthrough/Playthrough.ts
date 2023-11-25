import { GameKeeperDeps, Serializable } from '@core'
import { Entity } from '../Entity'
import { Game } from '../game'
import { GameId, PlayerId, PlaythroughId } from '@services'


// types
export interface PlaythroughData {
  id?: PlaythroughId
  gameId: GameId
  playerIds: ReadonlyArray<PlayerId>
  playedOn: Date
}


// class
export abstract class Playthrough
  extends Entity<PlaythroughId>
  implements Serializable<PlaythroughData> {

  public readonly playerIds: ReadonlyArray<PlayerId>
  public readonly gameId: GameId
  public readonly playedOn: Date

  public constructor(protected _deps: GameKeeperDeps, data: PlaythroughData) {
    super(data.id)
    this.gameId = data.gameId
    this.playerIds = data.playerIds
    this.playedOn = data.playedOn
  }

  public get game(): Game {
    return this._deps.store.getGame(this.gameId)
  }

  public abstract didWinBy(playerId: PlayerId): boolean

  public abstract get winnerName(): string

  public toData(): PlaythroughData {
    return {
      id: this.id,
      gameId: this.gameId,
      playedOn: this.playedOn,
      playerIds: this.playerIds
    }
  }

}