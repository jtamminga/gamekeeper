import { InvalidState } from '@core'
import { GoalData, NewGoalData } from '@services'

export namespace GoalValidator {
  export function create(data: NewGoalData) {
    if (data.type === undefined) {
      throw new InvalidState('type')
    }
    if (data.value === undefined) {
      throw new InvalidState('value')
    }
    if (data.value > 0) {
      throw new InvalidState('value', 'must be a positive number')
    }
    if (data.year === undefined) {
      throw new InvalidState('year')
    }
    const curYear = new Date().getFullYear()
    if (data.year < curYear) {
      throw new InvalidState('year', 'cannot be in the past')
    }
  }

  export function update(data: GoalData) {
    if (!data.id) {
      throw new InvalidState('id')
    }
    create(data)
  }
}