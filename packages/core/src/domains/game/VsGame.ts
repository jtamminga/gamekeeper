import { Game } from './Game'
import { GameData, GameType, type VsPlaythroughData } from '@services'
import type { VsPlaythrough } from '../playthrough'


// vs game domain
export class VsGame extends Game<VsPlaythrough> {

  public async record(data: Omit<VsPlaythroughData, 'gameId'>): Promise<VsPlaythrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough({ ...data, gameId: this.id })
    return this._deps.store.bindPlaythrough(dto) as VsPlaythrough
  }

  public toData(): GameData {
    return {
      ...this.toBaseData(),
      type: GameType.VS
    }
  }

}