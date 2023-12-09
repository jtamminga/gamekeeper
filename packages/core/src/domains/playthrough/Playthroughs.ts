import type { GameKeeperDeps } from '@core'
import type { PlaythroughQueryOptions } from '@services'
import type { CoopPlaythroughData } from './CoopPlaythrough'
import type { Playthrough, PlaythroughData } from './Playthrough'
import type { VsPlaythroughData } from './VsPlaythrough'
import type { CoopFlow, VsFlow } from '@flows'
import { PlaythroughFlowFactory } from '@factories'


// class
export class Playthroughs {

  constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(options?: PlaythroughQueryOptions): Promise<Playthroughs> {
    const dtos = await this._deps.services.playthroughService.getPlaythroughs(options)
    this._deps.logger.info(`playthroughs hydrated: ${dtos.length} records`)
    this._deps.store.bindPlaythroughs(dtos)
    return this
  }

  public all(): ReadonlyArray<Playthrough> {
    return [...this._deps.store.playthroughs].sort(playthroughCompareFn)
  }

  public async create(data: VsPlaythroughData | CoopPlaythroughData): Promise<Playthrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough(data)
    return this._deps.store.bindPlaythrough(dto)
  }

  public startFlow(data: Omit<PlaythroughData, 'id'>): VsFlow | CoopFlow {
    return PlaythroughFlowFactory.create(this._deps, data)
  }

}


// helpers
export function playthroughCompareFn(a: Playthrough, b: Playthrough): number {
  return a.playedOn.getTime() - b.playedOn.getTime()
}