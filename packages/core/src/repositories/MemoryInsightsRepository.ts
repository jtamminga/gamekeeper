import { GoalData, GoalId, GoalsQuery, Logger, NewGoalData, Services } from '@services'
import { InsightsRepository } from './InsightsRepository'
import { Goal, GoalFactory } from '@domains/insights'
import { NotFoundError } from '@core'
import { Gameplay } from '@domains/gameplay'


export class MemoryInsightsRepository implements InsightsRepository {

  private _goals: Map<GoalId, Goal>

  public constructor(private _gameplay: Gameplay, private _services: Services, private _logger: Logger) {
    this._goals = new Map<GoalId, Goal>()
  }


  public get goals(): ReadonlyArray<Goal> {
    return Array.from(this._goals, ([_, goal]) => goal)
  }

  public async hydrateGoals(query: GoalsQuery): Promise<ReadonlyArray<Goal>> {
    const goalsData = await this._services.goalService.getGoals(query)
    return goalsData.map(data => this.bindGoal(data))
  }

  public getGoal(id: GoalId): Goal {
    const goal = this._goals.get(id)
    if (!goal) {
      throw new NotFoundError(`could not find goal with id ${id}`)
    }
    return goal
  }

  public getGoals(query: GoalsQuery = {}): ReadonlyArray<Goal> {
    let goals = [...this.goals]
    if (query.year !== undefined) {
      goals = goals.filter(goal => goal.year === query.year)
    }

    return goals
  }

  public async createGoal(data: NewGoalData): Promise<Goal> {
    const goalData = await this._services.goalService.addGoal(data)
    return this.bindGoal(goalData)
  }

  public async updateGoal(goal: GoalData): Promise<void> {
    await this._services.goalService.updateGoal(goal)
  }

  public async removeGoal(id: GoalId): Promise<void> {
    await this._services.goalService.removeGoal(id)
    this._goals.delete(id)
  }

  private bindGoal(data: GoalData): Goal {
    let goal = this._goals.get(data.id)
    if (goal) {
      return goal
    }

    goal = GoalFactory.create(
      {
        logger: this._logger,
        service: this._services.statsService,
        gameplay: this._gameplay,
        repo: this
      },
      data
    )
    this._goals.set(data.id, goal)
    return goal
  }
}