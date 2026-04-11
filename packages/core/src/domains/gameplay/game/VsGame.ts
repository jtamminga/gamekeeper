import { Game } from './Game'
import { GameData, GameType, type VsPlaythroughData } from '@services'
import { VsPlaythrough } from '../playthrough'


/**
 * A competitive (vs) board game where one player wins against the others.
 * Playthroughs record a winner and optional per-player scores.
 */
export class VsGame extends Game<VsPlaythrough> {

  public async record(data: Omit<VsPlaythroughData, 'gameId'>): Promise<VsPlaythrough> {
    return this._deps.repo.createPlaythrough<VsPlaythrough>({ ...data, gameId: this.id })
  }

  public toData(): GameData {
    return {
      ...this.toBaseData(),
      type: GameType.VS
    }
  }

}