import { Game } from './Game'
import { GameType, ScoringType } from '@services'
import type { VsPlaythrough, VsPlaythroughData, ScoreData, Scores } from '../playthrough'


// vs game domain
export class VsGame extends Game<VsPlaythrough> {

  public readonly type = GameType.VS

  public async record(data: Omit<VsPlaythroughData, 'gameId'>): Promise<VsPlaythrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough({ ...data, gameId: this.id! })
    return this._deps.store.bindPlaythrough(dto) as VsPlaythrough
  }

  public determineWinner(scores: Scores): ScoreData {

    switch (this.scoring) {
      case ScoringType.HIGHEST_WINS:
        return scores.highest()
      case ScoringType.LOWEST_WINS:
        return scores.lowest()
      default:
        throw new Error(`winner cannot be determined with scoring type`)
    }
  }

}