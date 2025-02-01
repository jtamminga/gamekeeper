import { createValidationResult, mergeValidationResults, ValidationResult } from '@core'
import { GameData, GameType, NewGameData } from '@services'

export namespace GameValidation {
  export function create(data: NewGameData): ValidationResult {
    const errors: string[] = []

    if (!data.name) {
      errors.push('name is required')
    }
    if (data.scoring === undefined || data.scoring < 1 || data.scoring > 3 ) {
      errors.push('scoring must be between 1 and 3')
    }
    if (data.type !== GameType.VS && data.type !== GameType.COOP) {
      errors.push('type must be either vs or coop')
    }
    if (data.weight !== undefined && (data.weight < 0 || data.weight > 5)) {
      errors.push('weight must be between 0 and 5')
    }

    return createValidationResult(errors)
  }

  export function update(data: GameData): ValidationResult {
    const errors: string[] = []
    if (!data.id) {
      errors.push('id is required')
    }

    const result = create(data)
    return mergeValidationResults(errors, result)
  }
}