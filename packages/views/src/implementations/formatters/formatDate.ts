import { ISODate } from '@def/models'
import { format } from 'date-fns'

export function formatDate(date: Date, includeYear = true): string {
  return format(date, 'MMM d' + (includeYear ? ', yyyy' : ''))
}

export function toISODate(date: Date): ISODate {
  return date.toISOString() as ISODate
}