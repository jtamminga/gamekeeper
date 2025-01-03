import type { Goal } from './Goal'
import type { InsightsDeps } from '../Insights'
import { GoalId, GoalsQuery, NewGoalData } from '@services'


export class Goals {

  public constructor(
    private _deps: InsightsDeps
  ) { }

  public async hydrate(query: GoalsQuery = {}): Promise<Goals> {
    await this._deps.repo.hydrateGoals(query)
    return this
  }

  public all(query: GoalsQuery = {}): ReadonlyArray<Goal> {
    return this._deps.repo.getGoals(query)
  }

  public get(id: GoalId): Goal {
    return this._deps.repo.getGoal(id)
  }

  public async create(data: NewGoalData): Promise<Goal> {
    return this._deps.repo.createGoal(data)
  }

  public async remove(id: GoalId): Promise<void> {
    await this._deps.repo.removeGoal(id)
  }

  public topPriority(year: number): Goal | undefined {
    return this.all({ year })[0]
  }
}