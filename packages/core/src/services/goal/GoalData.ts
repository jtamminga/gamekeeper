import { NewData, Opaque } from '@core'

export type GoalId = Opaque<string, 'GoalId'>

export enum GoalType {
  NumPlays = 1
}

export interface GoalData {
  id: GoalId
  // name: string
  value: number
  type: GoalType
  year: number
}

export type NewGoalData = NewData<GoalData>
export type UpdatedGoalData = {
  id: GoalId
  value?: number
  type?: GoalType
  year?: number
}