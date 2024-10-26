import { Playthrough, VsPlaythrough } from '@domains/gameplay'
import { formatDate, toWinnerName } from './utils'
import { GameView } from './GameView'
import { FormattedScore, formatScores } from './FormattedPlaythroughs'
import { GameKeeper } from '@domains'


export class PlaythroughView extends GameView {

  public constructor(gamekeeper: GameKeeper, public readonly playthrough: Playthrough) {
    super(gamekeeper, playthrough.game.id, playthrough.players)
  }

  public get playedOn(): string {
    return formatDate(this.playthrough.playedOn)
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

  public get scores(): FormattedScore[] {
    return formatScores(this.playthrough)
  }

}