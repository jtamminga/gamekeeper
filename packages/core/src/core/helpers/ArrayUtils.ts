export namespace ArrayUtils {

  export function last<T>(items: readonly T[]): T | undefined {
    return items[items.length - 1]
  }

  export function notEmpty<T>(value: undefined | null | T): value is T {
    return value !== undefined && value !== null
  }

  export function sortedIndex<T>(array: T[], value: T, comparer: (a: T, b: T) => number): number {
    var low = 0,
      high = array.length
  
    while (low < high) {
      var mid = low + high >>> 1
      if (comparer(array[mid], value) < 0) low = mid + 1
      else high = mid
    }
    return low
  }

}