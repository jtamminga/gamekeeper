import { Request } from 'express'
import { InvalidParamsError } from './InvalidParamsError'
import { NewGoalData, UpdatedGoalData } from '@gamekeeper/core'


export function getGoalYear(req: Request): number {
  const { year } = req.query

  if (typeof year !== 'string') {
    throw new InvalidParamsError('year is required')
  }

  return parseInt(year)
}

export function toNewGoalData(req: Request): NewGoalData {
  const { type, goal, year } = req.body

  if (typeof type !== 'string') {
    throw new InvalidParamsError('type is required')
  }

  if (typeof goal !== 'string') {
    throw new InvalidParamsError('goal is required')
  }

  if (typeof year !== 'string') {
    throw new InvalidParamsError('year is required')
  }

  return {
    type: parseInt(type),
    goal: parseInt(goal),
    year: parseInt(year)
  }
}

export function toUpdatedGoalData(req: Request): Omit<UpdatedGoalData, 'id'> {
  const { id, type, goal, year } = req.body

  const data: Omit<UpdatedGoalData, 'id'> = { }

  if (typeof type === 'string') {
    data.type = parseInt(type)
  }
  if (typeof goal === 'string') {
    data.goal = parseInt(goal)
  }
  if (typeof year === 'string') {
    data.year = parseInt(year)
  }

  return data
}