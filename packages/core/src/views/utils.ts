import { CoopPlaythrough, type Playthrough, VsPlaythrough } from '@domains/gameplay'
import { PlaysByDateDto } from '@services'
import { addDays, format, isBefore, isSameDay, startOfWeek } from 'date-fns'


export function formatDate(date: Date, includeYear = true): string {
  return format(date, 'MMM d' + (includeYear ? ', yyyy' : ''))
}

export function formatPercent(value: number | undefined): string {
  return value?.toLocaleString('en-US', { style: 'percent' }) ?? '—'
}

export function formatNumber(value: number): string {
  return (Math.round(value * 10) / 10).toString()
}

export function toWinnerName(playthrough: Playthrough): string {
  if (playthrough instanceof VsPlaythrough) {
    return playthrough.winner === undefined
      ? 'tied'
      : playthrough.winner.name
  }

  else if (playthrough instanceof CoopPlaythrough) {
    return playthrough.playersWon
      ? 'players'
      : 'game'
  }

  else {
    throw new Error('unsupported playthrough type')
  }
}

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