export class InvalidParamsError extends Error {
  public constructor (message: string) {
    super(message)
  }
}