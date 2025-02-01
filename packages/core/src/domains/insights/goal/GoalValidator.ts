import { createValidationResult, mergeValidationResults, ValidationResult } from '@core'
import { GoalData, NewGoalData } from '@services'

export namespace GoalValidator {
  export function create(data: NewGoalData): ValidationResult {
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

    return createValidationResult(errors)
  }

  export function update(data: GoalData): ValidationResult {
    const errors: string[] = []
    if (!data.id) {
      errors.push('id is required')
    }

    const result = create(data)
    return mergeValidationResults(errors, result)
  }
}