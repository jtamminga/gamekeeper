import type { GoalData, GoalId, NewGoalData, UpdatedGoalData } from './GoalData'


export type GoalsQuery = {
  year?: number
}


export interface GoalService {
  
  addGoal(goal: NewGoalData): Promise<GoalData>

  getGoal(id: GoalId): Promise<GoalData>

  getGoals(query?: GoalsQuery): Promise<readonly GoalData[]>

  updateGoal(goal: UpdatedGoalData): Promise<GoalData>

  removeGoal(id: GoalId): Promise<void>

}