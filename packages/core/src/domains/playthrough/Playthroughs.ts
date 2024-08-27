import { PlaythroughFlowFactory } from '@factories'
import type { PlaythroughFlow } from '@flows'
import { NotFoundError, type GameKeeperDeps } from '@core'
import type { Playthrough } from './Playthrough'
import type { GameId, NewBasePlaythroughData, NewPlaythroughData, PlaythroughId, PlaythroughQueryOptions } from '@services'


// class
export class Playthroughs {

  constructor(
    private _deps: GameKeeperDeps
  ) { }

  public async hydrate(options?: PlaythroughQueryOptions): Promise<Playthroughs> {
    const data = await this._deps.services.playthroughService.getPlaythroughs(options)
    this._deps.logger.info(`playthroughs hydrated: ${data.length} records`)
    this._deps.store.bindPlaythroughs(data)
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

  public get(id: PlaythroughId): Playthrough {
    const playthrough = this._deps.store.getPlaythrough(id)
    if (!playthrough) {
      throw new NotFoundError(`cannot find playthrough with id "${id}"`)
    }
    
    return playthrough
  }

  public async create(data: NewPlaythroughData): Promise<Playthrough> {
    const dto = await this._deps.services.playthroughService.addPlaythrough(data)
    return this._deps.store.bindPlaythrough(dto)
  }

  public async remove(id: PlaythroughId): Promise<void> {
    await this._deps.services.playthroughService.removePlaythrough(id)
    this._deps.store.removePlaythrough(id)
  }

  public startFlow(data: NewBasePlaythroughData): PlaythroughFlow {
    return PlaythroughFlowFactory.create(this._deps, data)
  }

  /**
   * sort playthroughs from latest first to earliest last
   */
  public static sortLastPlayedFirst(a: Playthrough, b: Playthrough): number {
    return b.playedOn.getTime() - a.playedOn.getTime()
  }

}