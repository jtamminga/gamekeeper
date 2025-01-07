import { GoalData, GoalId, GoalService, GoalsQuery, GoalType, NewGoalData, NotFoundError, UpdatedGoalData } from '@gamekeeper/core'
import { DbService } from './DbService'
import { UserId, whereUserId } from './User'


export interface DbGoalDto {
  id: number
  type: number
  value: number
  year: number
}


export class DbGoalService extends DbService implements GoalService {

  public async addGoal(goal: NewGoalData, userId?: UserId): Promise<GoalData> {
    const query = `INSERT INTO goals (user_id, type, year, value) VALUES (?, ?, ?, ?)`
    const id = await this._dataService.insert(query, userId, goal.type, goal.year, goal.value)
    return this.transform({ ...goal, id })
  }

  public async getGoals({ year }: GoalsQuery = {}, userId?: UserId): Promise<readonly GoalData[]> {
    let query = `SELECT g.* FROM goals g WHERE g.${whereUserId(userId, ':user_id')}`
    if (year !== undefined) {
      query += ' AND g.year = :year'
    }
    const goals = await this._dataService.all<DbGoalDto>(query, {
      ':user_id': userId,
      ':year': year
    })
    return goals.map(goal => this.transform(goal))
  }

    public async getGoal(id: GoalId, userId?: UserId): Promise<GoalData> {
      const query = `SELECT * FROM goals WHERE id = ? AND ${whereUserId(userId)}`
      const dto = await this._dataService.get<DbGoalDto>(query, id, userId)
  
      if (!dto) {
        throw new NotFoundError(`cannot find goal with id "${id}"`)
      }
  
      return this.transform(dto)
    }

  public async updateGoal(updatedGoal: UpdatedGoalData, userId?: UserId): Promise<GoalData> {
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

    const query = `UPDATE goals SET ${setStatements} WHERE id = ? AND ${whereUserId(userId)}`
    await this._dataService.run(query, ...updatedValues, updatedGoal.id, userId)
    return this.getGoal(updatedGoal.id)
  }

  public async removeGoal(id: GoalId, userId?: UserId): Promise<void> {
    const query = `DELETE FROM goals WHERE id = ? AND ${whereUserId(userId)}`
    await this._dataService.run(query, id, userId)
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