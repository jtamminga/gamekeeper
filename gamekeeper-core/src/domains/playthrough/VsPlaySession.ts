import { VsGame } from '../game'
import { Player } from '../player'
import { PlaySession, PlaySessionData } from './PlaySession'
import { VsPlaythrough } from './VsPlaythrough'


// types
export interface VsPlaySessionData extends PlaySessionData { }


// vs play session
export class VsPlaySession extends PlaySession {

  public constructor(data: VsPlaySessionData) {
    super(data)
  }

  // public finish(winner: Player, scores?: Map<Player, number>) {
  //   return new VsPlaythrough({
  //     gameId: this._gameId,
  //     playerIds: this._playerIds,
  //     playedOn: this.date,
  //     winner,
  //     scores
  //   })
  // }

}