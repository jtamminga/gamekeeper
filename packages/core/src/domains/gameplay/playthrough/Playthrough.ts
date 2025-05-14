import { Entity } from '@domains'
import type { BasePlaythroughData, GameId, PlayerId, PlaythroughId, UpdatedPlaythroughData } from '@services'
import type { Game } from '../game'
import type { Serializable } from '@core'
import type { Player } from '../player'
import type { GameplayDeps } from '../Gameplay'


// class
export abstract class Playthrough
  extends Entity<PlaythroughId>
  implements Serializable<BasePlaythroughData> {

  public readonly playerIds: ReadonlyArray<PlayerId>
  public readonly gameId: GameId
  public readonly playedOn: Date
  private _notes?: string
  private _startedOn?: Date
  private _endedOn?: Date

  public constructor(protected _deps: GameplayDeps, data: BasePlaythroughData) {
    super(data.id)
    this.gameId = data.gameId
    this.playerIds = data.playerIds
    this.playedOn = data.playedOn
    this._notes = data.notes
    this._startedOn = data.startedOn
    this._endedOn = data.endedOn
  }

  public get game(): Game {
    return this._deps.repo.getGame(this.gameId)
  }

  public get players(): ReadonlyArray<Player> {
    return this._deps.repo.getPlayers(this.playerIds)
  }

  public update(data: Omit<UpdatedPlaythroughData, 'id'>): void {
    this._notes = data.notes
  }

  public toData(): BasePlaythroughData {
    const data: BasePlaythroughData = {
      id: this.id,
      gameId: this.gameId,
      playedOn: this.playedOn,
      playerIds: this.playerIds
    }
    if (this._notes) {
      data.notes = this._notes
    }
    if (this._startedOn) {
      data.startedOn = this._startedOn
    }
    if (this._endedOn) {
      data.endedOn = this._endedOn
    }

    return data
  }

}