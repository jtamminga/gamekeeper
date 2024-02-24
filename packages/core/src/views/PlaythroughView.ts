import { Playthrough, VsPlaythrough } from '@domains'
import { toWinnerName } from './PlaythroughPreview'
import { GameView } from './GameView'


export class PlaythroughView extends GameView {

  public constructor(public readonly playthrough: Playthrough) {
    super(playthrough.game, playthrough.players)
  }

  public get winner(): string {
    return toWinnerName(this.playthrough)
  }

  public get tied(): boolean {
    if (this.playthrough instanceof VsPlaythrough) {
      return this.playthrough.tied
    }

    return false
  }

}