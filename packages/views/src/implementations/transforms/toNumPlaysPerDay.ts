import { PlaysByDateDto } from '@gamekeeper/core'
import { addDays, isBefore, isSameDay, startOfWeek } from 'date-fns'


/**
 * Converts plays by date to an array with each index representing a day
 * @param playsByDate play count grouped by date
 * @param year what year this is for
 */
export function toNumPlaysPerDay(playsByDate: PlaysByDateDto[], year: number): { plays: number[], firstDate: Date } {
  const firstDate = startOfWeek(new Date(year, 0))
  let curDay = firstDate

  let index = 0
  const today = Date.now()
  const result: number[] = []
  while(isBefore(curDay, today)) {
    if (isSameDay(curDay, playsByDate[index]?.date)) {
      result.push(playsByDate[index].plays)
      index++
    } else {
      result.push(0)
    }

    curDay = addDays(curDay, 1)
  }
  return {
    firstDate,
    plays: result
  }
}