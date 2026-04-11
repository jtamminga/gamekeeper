import { Game } from './Game'
import { CoopPlaythroughData, GameData, GameType } from '@services'
import { CoopPlaythrough } from '../playthrough'


/**
 * A cooperative board game where all players win or lose together.
 * Playthroughs record an outcome (win/loss) and an optional group score.
 */
export class CoopGame extends Game<CoopPlaythrough> {

  public async record(data: Omit<CoopPlaythroughData, 'gameId'>): Promise<CoopPlaythrough> {
    return this._deps.repo.createPlaythrough<CoopPlaythrough>({ ...data, gameId: this.id })
  }
  
  public toData(): GameData {
    return {
      ...this.toBaseData(),
      type: GameType.COOP
    }
  }

}