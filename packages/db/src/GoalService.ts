import { GoalData, GoalId, GoalService, GoalType, NewGoalData, NotFoundError, UpdatedGoalData } from '@gamekeeper/core'
import { DbService } from './DbService'


export interface DbGoalDto {
  id: number
  type: number
  value: number
  year: number
}


export class DbGoalService extends DbService implements GoalService {

  public async addGoal(goal: NewGoalData): Promise<GoalData> {
    const query = `INSERT INTO goals (type, year, value) VALUES (?, ?, ?)`
    const id = await this._dataService.insert(query, goal.type, goal.year, goal.value)
    return this.transform({ ...goal, id })
  }

  public async getGoals(year: number): Promise<readonly GoalData[]> {
    const query = 'SELECT g.* FROM goals g WHERE g.year = ?'
    const goals = await this._dataService.all<DbGoalDto>(query, year)
    return goals.map(goal => this.transform(goal))
  }

    public async getGoal(id: GoalId): Promise<GoalData> {
      const query = 'SELECT * FROM goals WHERE id = ?'
      const dto = await this._dataService.get<DbGoalDto>(query, id)
  
      if (!dto) {
        throw new NotFoundError(`cannot find goal with id "${id}"`)
      }
  
      return this.transform(dto)
    }

  public async updateGoal(updatedGoal: UpdatedGoalData): Promise<GoalData> {
    const mapping: Record<string, string> = {
      type: 'type',
      value: 'value',
      year: 'year'
    }

    const mappedKeys = Object.keys(updatedGoal)
      .map(key => mapping[key])
      .filter(key => key !== undefined)
    const setStatements = mappedKeys
      .map(key => `${key} = ?`)
      .join(',')
    const updatedValues = mappedKeys.map(key =>
      updatedGoal[key as keyof UpdatedGoalData])

    const query = `UPDATE goals SET ${setStatements} WHERE id = ?`
    await this._dataService.run(query, ...updatedValues, updatedGoal.id)
    return this.getGoal(updatedGoal.id)
  }

  public async removeGoal(id: GoalId): Promise<void> {
    const query = `DELETE FROM goals WHERE id = ?`
    await this._dataService.run(query, id)
  }

  private transform(goal: DbGoalDto): GoalData {
    const data: GoalData = {
      id: goal.id.toString() as GoalId,
      type: goal.type as GoalType,
      value: goal.value,
      year: goal.year
    }
  
    return data
  }
  
}