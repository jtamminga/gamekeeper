import { InvalidState, NewData, Opaque } from '@core'

export type GoalId = Opaque<string, 'GoalId'>

export enum GoalType {
  NumberOfPlays = 1,
  UniqueGamesPlayed = 2
}

export interface GoalData {
  id: GoalId
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

export namespace NewGoalData {
  export function errors(data: NewGoalData): string[] {
    const errors: string[] = []

    if (data.type === undefined) {
      errors.push('type is required')
    }
    if (data.value === undefined) {
      errors.push('value is required')
    }
    if (data.value <= 0) {
      errors.push('value must be greater than 0')
    }
    if (data.year === undefined) {
      errors.push('year is required')
    }
    const curYear = new Date().getFullYear()
    if (data.year < curYear) {
      errors.push('year must be greater than or equal to current year')
    }

    return errors
  }

  export function throwIfInvalid(data: NewGoalData): void {
    const errors = NewGoalData.errors(data)
    if (errors.length > 0) {
      throw new InvalidState(errors)
    }
  }
}

export namespace GoalData {
  export function errors(data: GoalData): string[] {
    const errors: string[] = []
    if (!data.id) {
      errors.push('id is required')
    }

    return NewGoalData.errors(data).concat(errors)
  }
  
  export function throwIfInvalid(data: GoalData): void {
    const errors = GoalData.errors(data)
    if (errors.length > 0) {
      throw new InvalidState(errors)
    }
  }
}