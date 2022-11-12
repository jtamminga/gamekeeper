export namespace ArrayUtils {

  export function last<T>(items: readonly T[]): T | undefined {
    return items[items.length - 1]
  }

  export function notEmpty<T>(value: undefined | null | T): value is T {
    return value !== undefined && value !== null
  }

}