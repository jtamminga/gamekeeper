import type { Goal } from './Goal'
import type { InsightsDeps } from '../Insights'
import { GoalId, GoalsQuery, NewGoalData } from '@services'
import { GoalValidator } from './GoalValidator'


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
    GoalValidator.create(data)
    return this._deps.repo.createGoal(data)
  }

  public async save(goal: Goal): Promise<void> {
    const updatedData = goal.toData()
    GoalValidator.update(updatedData)
    this._deps.repo.updateGoal(updatedData)
  }

  public async remove(id: GoalId): Promise<void> {
    await this._deps.repo.removeGoal(id)
  }

  public topPriority(year: number): Goal | undefined {
    return this.all({ year })[0]
  }
}