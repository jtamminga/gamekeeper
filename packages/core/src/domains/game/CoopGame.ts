import { GameType, PlaythroughId } from '@services'
import { CoopPlaythrough, CoopPlaythroughData } from '../playthrough'
import { CoopGameStats } from './CoopGameStats'
import { Game } from './Game'


// class
export class CoopGame extends Game<CoopPlaythrough> {

  public readonly type = GameType.COOP

  public async record(data: Omit<CoopPlaythroughData, 'gameId'>): Promise<CoopPlaythrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough({ ...data, gameId: this.id! })
    this._deps.builder.bindPlaythrough(dto)
    return this._deps.builder.data.playthroughs[dto.id.toString() as PlaythroughId] as CoopPlaythrough
  }

  public getStats(): CoopGameStats {
    return new CoopGameStats(this._deps, this)
  }

}