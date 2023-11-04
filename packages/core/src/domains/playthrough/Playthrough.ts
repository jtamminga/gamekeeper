import { GameKeeperDeps } from '@core'
import { Model } from '../Model'
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
export abstract class Playthrough extends Model<PlaythroughId> {

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
    return this._deps.builder.data.games[this.gameId]
  }

  public abstract didWinBy(playerId: PlayerId): boolean

  public abstract get winnerName(): string

}