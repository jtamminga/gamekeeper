import { createValidationResult, mergeValidationResults, ValidationResult } from '@core'
import { NewBasePlaythroughData, NewPlaythroughData } from '@services'

export namespace PlaythroughValidation {
  export function startFlow(data: NewBasePlaythroughData): ValidationResult {
    const errors: string[] = []

    if (!data.gameId) {
      errors.push('gameId is required')
    }
    if (!data.playedOn) {
      errors.push('playedOn is required')
    }
    if (!data.playerIds) {
      errors.push('playerIds is required')
    }
    if (data.playerIds.length === 0) {
      errors.push('playerIds must have at least one player')
    }

    return createValidationResult(errors)
  }

  export function create(data: NewPlaythroughData): ValidationResult {
    const result = startFlow(data)

    const errors: string[] = []
    if (!data.type || (data.type !== 'coop' && data.type !== 'vs')) {
      errors.push('type must be either coop or vs')
    }

    return mergeValidationResults(errors, result)
  }
}