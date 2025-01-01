import type { Goal } from '@domains/insights'
import type { GoalId, NewGoalData } from '@services'


export interface InsightsRepository {

  // goals
  goals: ReadonlyArray<Goal>
  hydrateGoals(year: number): Promise<ReadonlyArray<Goal>>
  getGoal(id: GoalId): Goal
  createGoal(data: NewGoalData): Promise<Goal>
  updateGoal(goal: Goal): Promise<void>
  removeGoal(id: GoalId): Promise<void>

}