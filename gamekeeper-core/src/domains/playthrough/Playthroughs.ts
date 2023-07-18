import { GameKeeperDeps } from '@core'
import { PlaythroughQueryOptions } from '@services'
import { CoopPlaythroughData } from './CoopPlaythrough'
import { Playthrough, PlaythroughData, PlaythroughId } from './Playthrough'
import { VsPlaythroughData } from './VsPlaythrough'


// class
export class Playthroughs {

  constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(options?: PlaythroughQueryOptions): Promise<Playthroughs> {
    const dtos = await this._deps.service.playthroughService.getPlaythroughs(options)
    this._deps.builder.bindPlaythroughs(dtos)
    return this
  }

  public all(): ReadonlyArray<Playthrough> {
    return Object.values(this._deps.builder.data.playthroughs)
      .sort(playthroughCompareFn)
  }

  public async create(data: VsPlaythroughData | CoopPlaythroughData): Promise<Playthrough> {
    const dto = await this._deps.service.playthroughService.addPlaythrough(data)
    this._deps.builder.bindPlaythrough(dto)
    return this._deps.builder.data.playthroughs[dto.id.toString() as PlaythroughId]
  }

}


export function playthroughCompareFn(a: Playthrough, b: Playthrough): number {
  return a.playedOn.getTime() - b.playedOn.getTime()
}