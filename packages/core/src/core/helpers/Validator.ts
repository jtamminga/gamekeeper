type ValidResult = { valid: true }
type InvalidResult = { valid: false; errors: string[] }

export type ValidationResult = ValidResult | InvalidResult

export type Validator<T> = (data: T) => ValidationResult

export function createValidationResult(errors: string[]): ValidationResult {
  if (errors.length > 0) {
    return { valid: false, errors }
  } else {
    return { valid: true }
  }
}

export function mergeValidationResults(errors: string[], otherResult: ValidationResult): ValidationResult {
  if (otherResult.valid) {
    return createValidationResult(errors)
  } else {
    return createValidationResult(errors.concat(otherResult.errors))
  }
}