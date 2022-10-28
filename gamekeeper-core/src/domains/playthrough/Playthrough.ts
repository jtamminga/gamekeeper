import { Opaque } from '@core'
import { Model } from '../Model'
import { Game, GameId } from '../game'
import { Player, PlayerId } from '../player'


// types
export type PlaythroughId = Opaque<string, 'PlaythroughId'>
export interface PlaythroughData {
  id?: PlaythroughId
  gameId: GameId
  playerIds: readonly PlayerId[]
  playedOn: Date
}


// class
export class Playthrough extends Model<PlaythroughId> {

  public readonly playerIds: ReadonlyArray<PlayerId>
  public readonly gameId: GameId
  public readonly playedOn: Date

  public constructor(data: PlaythroughData) {
    super(data.id)
    this.gameId = data.gameId
    this.playerIds = data.playerIds
    this.playedOn = data.playedOn
  }

  public get game(): Game {
    throw new Error('not implemented')
  }

  public get players(): readonly Player[] {
    throw new Error('not implmeneted')
  }

}