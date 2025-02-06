import { LimitError } from '@core'
import { GoalData, GoalId, GoalsQuery, NewGoalData } from '@services'
import type { Goal } from './Goal'
import type { InsightsDeps } from '../Insights'


const MAX_GOALS_PER_YEAR = 3
const MAX_GOALS = 100


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
    NewGoalData.throwIfInvalid(data)

    const goalsForYear = this.all({ year: data.year })
    if (goalsForYear.length > MAX_GOALS_PER_YEAR) {
      throw new LimitError(`Cannot create more than ${MAX_GOALS_PER_YEAR} goals per year`)
    }
    if (this._deps.repo.goals.length > MAX_GOALS) {
      throw new LimitError(`Cannot create more than ${MAX_GOALS} goals`)
    }
    if (goalsForYear.some(g => g.type === data.type)) {
      throw new LimitError(`Cannot create more than one goal of the same type per year`)
    }
    
    return this._deps.repo.createGoal(data)
  }

  public async save(goal: Goal): Promise<void> {
    const updatedData = goal.toData()
    GoalData.throwIfInvalid(updatedData)
    this._deps.repo.updateGoal(updatedData)
  }

  public async remove(id: GoalId): Promise<void> {
    await this._deps.repo.removeGoal(id)
  }

  public topPriority(year: number): Goal | undefined {
    return this.all({ year })[0]
  }
}