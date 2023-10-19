import { Game, GameType, ScoringType } from './Game'
import { PlaythroughId, VsPlaythrough, VsPlaythroughData } from '../playthrough'
import { ScoreData, Scores } from 'domains/playthrough/Scores'
import { VsGameStats } from './VsGameStats'


// vs game domain
export class VsGame extends Game<VsPlaythrough> {

  public readonly type = GameType.VS

  public async record(data: Omit<VsPlaythroughData, 'gameId'>): Promise<VsPlaythrough> {
    const dto = await this._deps.service.playthroughService.addPlaythrough({ ...data, gameId: this.id! })
    this._deps.builder.bindPlaythrough(dto)
    return this._deps.builder.data.playthroughs[dto.id.toString() as PlaythroughId] as VsPlaythrough
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

  public getStats(): VsGameStats {
    return new VsGameStats(this._deps, this)
  }

}