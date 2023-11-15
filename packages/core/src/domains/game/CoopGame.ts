import { GameType } from '@services'
import { CoopPlaythrough, CoopPlaythroughData } from '../playthrough'
import { Game } from './Game'


// class
export class CoopGame extends Game<CoopPlaythrough> {

  public readonly type = GameType.COOP

  public async record(data: Omit<CoopPlaythroughData, 'gameId'>): Promise<CoopPlaythrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough({ ...data, gameId: this.id! })
    return this._deps.store.bindPlaythrough(dto) as CoopPlaythrough
  }

}