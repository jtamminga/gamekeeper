export class InvalidState extends Error {
  public constructor(property: string, reason = 'not defined') {
    super(`${property}: ${reason}`)
  }
}