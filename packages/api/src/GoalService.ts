import { GoalData, GoalId, GoalService, GoalType, NewGoalData, UpdatedGoalData } from '@gamekeeper/core'
import { ApiService } from './ApiService'
import { Route } from '@gamekeeper/views'


// types
interface ApiGoalDto {
  id: string
  type: number
  value: number
  year: number
}


export class ApiGoalService extends ApiService implements GoalService {
  
  public async addGoal(goal: NewGoalData): Promise<GoalData> {
    const newGoal = await this.apiClient.post<ApiGoalDto>(Route.GOALS, goal)
    return this.transform(newGoal)
  }

  public async getGoals(year: number): Promise<readonly GoalData[]> {
    const goals = await this.apiClient.get<ApiGoalDto[]>(Route.GOALS, { year: year.toString() })
    return goals.map(this.transform)
  }

  public async getGoal(id: GoalId): Promise<GoalData> {
    const goal = await this.apiClient.get<ApiGoalDto>(Route.forGoal(id))
    return this.transform(goal)
  }

  public async updateGoal(updatedGoal: UpdatedGoalData): Promise<GoalData> {
    const goal = await this.apiClient.patch<ApiGoalDto>(Route.forGoal(updatedGoal.id), updatedGoal)
    return this.transform(goal)
  }

  public async removeGoal(id: GoalId): Promise<void> {
    await this.apiClient.delete(Route.forGoal(id))
  }

  private transform(goal: ApiGoalDto): GoalData {
    return {
      id: goal.id as GoalId,
      type: goal.type as GoalType,
      value: goal.value,
      year: goal.year
    }
  }

}