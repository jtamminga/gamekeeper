import type { Goal } from '@domains/insights'
import type { GoalId, GoalsQuery, NewGoalData } from '@services'


export interface InsightsRepository {

  // goals
  goals: ReadonlyArray<Goal>
  hydrateGoals(query: GoalsQuery): Promise<ReadonlyArray<Goal>>
  getGoal(id: GoalId): Goal
  getGoals(query?: GoalsQuery): ReadonlyArray<Goal> 
  createGoal(data: NewGoalData): Promise<Goal>
  updateGoal(goal: Goal): Promise<void>
  removeGoal(id: GoalId): Promise<void>

}