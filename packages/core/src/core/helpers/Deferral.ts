export class Deferral<T> {
  public promise: Promise<T>
  public resolve!: (value: T) => void
  public reject!: (reason?: any) => void

  public constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject 
    })
  }
}