import { createValidationResult, mergeValidationResults, ValidationResult } from '@core'
import type { NewPlayerData, PlayerData } from '@services'

export namespace PlayerValidation {

  export function create(data: NewPlayerData): ValidationResult {
    const errors: string[] = []
    if (!data.name) {
      errors.push('name is required')
    }

    return createValidationResult(errors)
  }

  export function update(data: PlayerData): ValidationResult {
    const errors: string[] = []
    if (!data.id) {
      errors.push('id is required')
    }
    
    const result = create(data)
    return mergeValidationResults(errors, result)
  }

}