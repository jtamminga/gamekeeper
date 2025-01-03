import type { Goal } from './Goal'
import type { InsightsDeps } from '../Insights'
import { GoalId, NewGoalData } from '@services'


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

  public get(id: GoalId): Goal {
    return this._deps.repo.getGoal(id)
  }

  public async create(data: NewGoalData): Promise<Goal> {
    return this._deps.repo.createGoal(data)
  }

  public get topPriority(): Goal | undefined {
    return this.all()[0]
  }
}