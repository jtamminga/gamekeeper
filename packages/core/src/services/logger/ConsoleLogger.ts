import { Logger } from './Logger'


// class
export class ConsoleLogger implements Logger {

  public constructor(private _silent: boolean = false) { }

  public info(message: string): void {
    if (!this._silent) {
      console.info(message)
    }
  }

  public warn(message: string): void {
    if (!this._silent) {
      console.warn(message)
    }
  }

  public error(message: string): void {
    if (!this._silent) {
      console.error(message)
    }
  }

}