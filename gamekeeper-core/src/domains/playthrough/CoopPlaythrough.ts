import { CoopGame } from '../game'
import { Playthrough, PlaythroughData } from './Playthrough'


// types
export interface CoopPlaythroughData extends PlaythroughData {
  playersWon: boolean
  score?: number
}


// class
export class CoopPlaythrough extends Playthrough {

  public readonly playersWon: boolean
  public readonly score?: number

  public constructor(data: CoopPlaythroughData) {
    super(data)
    this.playersWon = data.playersWon
    this.score = data.score
  }

}