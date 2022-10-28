import { CoopGame } from '../game'
import { CoopPlaythrough } from './CoopPlaythrough'
import { PlaySession, PlaySessionData } from './PlaySession'


// types
export interface CoopyPlaySessionData extends PlaySessionData { }


// coop play session
export class CoopyPlaySession extends PlaySession {

  public constructor(data: CoopyPlaySessionData) {
    super(data)
  }

  // public finish(playersWon: boolean, score?: number) {
  //   return new CoopPlaythrough({
  //     gameId: this.game,
  //     playerIds: this.players,
  //     playedOn: this.date,
  //     playersWon,
  //     score
  //   })
  // }

}