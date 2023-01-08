import { PlayerId } from '../player'
import { Playthrough, PlaythroughData } from './Playthrough'
import { ScoreData, Scores } from './Scores'


// types
export interface VsPlaythroughData extends PlaythroughData {
  winnerId: PlayerId
  scores?: ReadonlyArray<ScoreData>
}


// class
export class VsPlaythrough extends Playthrough {

  public readonly winnerId: PlayerId
  public readonly scores?: Scores

  public constructor(data: VsPlaythroughData) {
    super(data)
    this.winnerId = data.winnerId
    this.scores = data.scores
      ? new Scores(data.scores)
      : undefined
  }

}