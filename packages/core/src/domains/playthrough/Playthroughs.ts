import { PlaythroughFlowFactory } from '@factories'
import type { CoopFlow, VsFlow } from '@flows'
import type { GameKeeperDeps } from '@core'
import type { NewBasePlaythroughData, Playthrough } from './Playthrough'
import type { GameId, PlaythroughQueryOptions } from '@services'
import type { NewVsPlaythroughData } from './VsPlaythrough'
import type { NewCoopPlaythroughData } from './CoopPlaythrough'


// types
export type NewPlaythroughData = NewVsPlaythroughData | NewCoopPlaythroughData


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
    return [...this._deps.store.playthroughs].sort(Playthroughs.sortLastPlayedFirst)
  }

  public latest(limit = 10, gameId?: GameId): ReadonlyArray<Playthrough> {
    const playthroughs = gameId === undefined
      ? this.all()
      : this.all().filter(p => p.gameId === gameId)

    return playthroughs.slice(0, limit)
  }

  public async create(data: NewPlaythroughData): Promise<Playthrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough(data)
    return this._deps.store.bindPlaythrough(dto)
  }

  public startFlow(data: NewBasePlaythroughData): VsFlow | CoopFlow {
    return PlaythroughFlowFactory.create(this._deps, data)
  }

  /**
   * sort playthroughs from latest first to earliest last
   */
  public static sortLastPlayedFirst(a: Playthrough, b: Playthrough): number {
    return b.playedOn.getTime() - a.playedOn.getTime()
  }

}