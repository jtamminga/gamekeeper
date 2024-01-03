import { Game, type GameData } from './Game'
import { GameType } from '@services'
import type { CoopPlaythrough, CoopPlaythroughData } from '../playthrough'


// class
export class CoopGame extends Game<CoopPlaythrough> {

  public async record(data: Omit<CoopPlaythroughData, 'gameId'>): Promise<CoopPlaythrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough({ ...data, gameId: this.id })
    return this._deps.store.bindPlaythrough(dto) as CoopPlaythrough
  }
  
  public toData(): GameData {
    return {
      ...this.toBaseData(),
      type: GameType.COOP
    }
  }

}