import { Game } from './Game'
import { GameType } from '@services'
import type { VsPlaythrough, VsPlaythroughData } from '../playthrough'


// vs game domain
export class VsGame extends Game<VsPlaythrough> {

  public readonly type = GameType.VS

  public async record(data: Omit<VsPlaythroughData, 'gameId'>): Promise<VsPlaythrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough({ ...data, gameId: this.id! })
    return this._deps.store.bindPlaythrough(dto) as VsPlaythrough
  }

}