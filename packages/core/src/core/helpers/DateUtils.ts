import { endOfYear } from 'date-fns'


export namespace DateUtils {

  export function getDateRangeFromYear(year: number): { fromDate: Date, toDate: Date } {
    const fromDate = new Date(year, 0, 1)
    return {
      fromDate,
      toDate: endOfYear(fromDate)
    }
  }
  
}