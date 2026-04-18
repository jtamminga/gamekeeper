import { DecodeError } from './DecodeError'

export class RequiredError extends DecodeError {
  public constructor(prop: string) {
    super(`Required prop "${prop}" missing`)
  }
}
