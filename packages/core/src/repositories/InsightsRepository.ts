import type { Goal } from '@domains/insights'
import type { GoalData, GoalId, GoalsQuery, NewGoalData } from '@services'


export interface InsightsRepository {

  // goals
  goals: ReadonlyArray<Goal>
  hydrateGoals(query: GoalsQuery): Promise<ReadonlyArray<Goal>>
  getGoal(id: GoalId): Goal
  getGoals(query?: GoalsQuery): ReadonlyArray<Goal> 
  createGoal(data: NewGoalData): Promise<Goal>
  updateGoal(goal: GoalData): Promise<void>
  removeGoal(id: GoalId): Promise<void>

}