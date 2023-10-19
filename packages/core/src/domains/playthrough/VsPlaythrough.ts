import { GameKeeperDeps } from '@core'
import { VsGame } from '../game'
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

  public constructor(deps: GameKeeperDeps, data: VsPlaythroughData) {
    super(deps, data)
    this.winnerId = data.winnerId
    this.scores = data.scores
      ? new Scores(data.scores)
      : undefined
  }

  public get game(): VsGame {
    return super.game as VsGame
  }

  public didWinBy(playerId: PlayerId): boolean {
    return this.winnerId === playerId
  }

  public get winnerName(): string {
    return this._deps.builder.data.players[this.winnerId].name
  }

}