import { format } from 'date-fns'

export function formatDate(date: Date, includeYear = true): string {
  return format(date, 'MMM d' + (includeYear ? ', yyyy' : ''))
}