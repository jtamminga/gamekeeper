import { Game } from './Game'
import { GameData, GameType, type VsPlaythroughData } from '@services'
import { VsPlaythrough } from '../playthrough'


// vs game domain
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