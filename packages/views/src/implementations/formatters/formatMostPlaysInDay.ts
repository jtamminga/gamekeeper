import type { FormattedMostPlaysInDay } from '@def/models'
import type { PlaysByDateData } from '@gamekeeper/core'
import { formatDate } from './formatDate'


export function formatMostPlaysInDay(playsByDate: PlaysByDateData[]): FormattedMostPlaysInDay {
  const topDay = playsByDate.reduce((top, day) => {
    return day.plays > top.plays ? day : top
  }, {plays: 0, date: new Date(0)})

  return {
    plays: topDay.plays,
    date: topDay.date.toISOString(),
    dateFormatted: formatDate(topDay.date)
  }
}