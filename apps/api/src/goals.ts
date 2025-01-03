import { Request } from 'express'
import { InvalidParamsError } from './InvalidParamsError'
import { GoalsQuery, NewGoalData, UpdatedGoalData } from '@gamekeeper/core'


export function toNewGoalData(req: Request): NewGoalData {
  const { type, value, year } = req.body

  if (typeof type !== 'number') {
    throw new InvalidParamsError('type is required')
  }

  if (typeof value !== 'number') {
    throw new InvalidParamsError('value is required')
  }

  if (typeof year !== 'number') {
    throw new InvalidParamsError('year is required')
  }

  return {
    type,
    value,
    year
  }
}

export function toUpdatedGoalData(req: Request): Omit<UpdatedGoalData, 'id'> {
  const { type, value, year } = req.body

  const data: Omit<UpdatedGoalData, 'id'> = { }

  if (typeof type === 'number') {
    data.type = type
  }
  if (typeof value === 'number') {
    data.value = value
  }
  if (typeof year === 'number') {
    data.year = year
  }

  return data
}

export function toGoalsQuery(req: Request): GoalsQuery {
  const { year } = req.query
  
  const query: GoalsQuery = {}
  if (typeof year === 'number') {
    query.year = year
  }

  return query
}