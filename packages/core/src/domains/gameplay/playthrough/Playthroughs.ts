import { type PlaythroughFlow, PlaythroughFlowFactory } from './flow'
import type { GameId, NewBasePlaythroughData, NewPlaythroughData, PlaythroughId, PlaythroughQueryOptions } from '@services'
import type { GameplayDeps } from '../Gameplay'
import type { Playthrough } from './Playthrough'


// class
export class Playthroughs {

  constructor(
    private _deps: GameplayDeps
  ) { }

  public async hydrate(options?: PlaythroughQueryOptions): Promise<Playthroughs> {
    await this._deps.repo.hydratePlaythroughs(options)
    return this
  }

  public all(options?: PlaythroughQueryOptions): ReadonlyArray<Playthrough> {
    return this._deps.repo.getPlaythroughs(options)
  }

  public latest(limit = 10, gameId?: GameId): ReadonlyArray<Playthrough> {
    return this._deps.repo.getPlaythroughs({ limit, gameId })
  }

  public last(gameId?: GameId): Playthrough | undefined {
    return this._deps.repo.getPlaythroughs({ limit: 1, gameId })[0]
  }

  public get(id: PlaythroughId): Playthrough {
    return this._deps.repo.getPlaythrough(id)
  }

  public async create(data: NewPlaythroughData): Promise<Playthrough> {
    return this._deps.repo.createPlaythrough(data)
  }

  public async remove(id: PlaythroughId): Promise<void> {
    await this._deps.repo.removePlaythrough(id)
  }

  public startFlow(data: NewBasePlaythroughData): PlaythroughFlow {
    return PlaythroughFlowFactory.create(this._deps, data)
  }

}