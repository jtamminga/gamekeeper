import type { Goal } from './Goal'
import type { InsightsDeps } from '../Insights'


export class Goals {

  public constructor(
    private _deps: InsightsDeps
  ) { }

  public async hydrate(year: number): Promise<Goals> {
    await this._deps.repo.hydrateGoals(year)
    return this
  }

  public all(): ReadonlyArray<Goal> {
    return this._deps.repo.goals
  }

  public get topPriority(): Goal | undefined {
    return this.all()[0]
  }
}