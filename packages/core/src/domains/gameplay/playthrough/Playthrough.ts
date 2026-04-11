import { Entity } from '@domains'
import type { BasePlaythroughData, GameId, PlayerId, PlaythroughId, UpdatedPlaythroughData } from '@services'
import type { Game } from '../game'
import type { Serializable } from '@core'
import type { Player } from '../player'


export type PlaythroughArgs = Omit<BasePlaythroughData, 'gameId' | 'playerIds'> & {
  game: Game
  players: ReadonlyArray<Player>
}


/**
 * Abstract base for a recorded session of playing a board game.
 * Captures the core facts of a play: which game, which players, and when it happened.
 * Subclasses add game-type-specific data (outcome, scores).
 */
export abstract class Playthrough
  extends Entity<PlaythroughId>
  implements Serializable<BasePlaythroughData> {

  public readonly playerIds: ReadonlyArray<PlayerId>
  public readonly gameId: GameId
  public readonly playedOn: Date
  private _game: Game
  private _players: ReadonlyArray<Player>
  private _notes?: string
  private _startedOn?: Date
  private _endedOn?: Date

  public constructor(data: PlaythroughArgs) {
    super(data.id)
    this._game = data.game
    this._players = data.players
    this.gameId = data.game.id
    this.playerIds = data.players.map(p => p.id)
    this.playedOn = data.playedOn
    this._notes = data.notes
    this._startedOn = data.startedOn
    this._endedOn = data.endedOn
  }

  public get playerIdSet(): Set<PlayerId> {
    return new Set(this.playerIds)
  }

  public get game(): Game {
    return this._game
  }

  public get players(): ReadonlyArray<Player> {
    return this._players
  }

  public get notes(): string | undefined {
    return this._notes
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
