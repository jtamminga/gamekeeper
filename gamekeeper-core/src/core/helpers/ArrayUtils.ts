export namespace ArrayUtils {

  export function last<T>(items: readonly T[]): T {
    return items[items.length - 1]
  }

}