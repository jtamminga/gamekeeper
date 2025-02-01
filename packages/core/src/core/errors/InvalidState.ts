export class InvalidState extends Error {
  public constructor(errors: string[]) {
    super(`Invalid state: ${errors.join(', ')}`)
  }
}