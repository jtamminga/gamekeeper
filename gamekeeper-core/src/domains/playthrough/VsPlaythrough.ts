import { VsGame } from '../game'
import { Player, PlayerId } from '../player'
import { Playthrough, PlaythroughData } from './Playthrough'


// types
export interface VsPlaythroughData extends PlaythroughData {
  winnerId: PlayerId
  scores?: ReadonlyMap<PlayerId, number> 
}


// class
export class VsPlaythrough extends Playthrough {

  public readonly winnerId: PlayerId
  public readonly scores?: ReadonlyMap<PlayerId, number>

  public constructor(data: VsPlaythroughData) {
    super(data)
    this.winnerId = data.winnerId
    this.scores = data.scores
  }

}