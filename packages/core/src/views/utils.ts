import { format } from 'date-fns'


export function formatDate(date: Date, includeYear = true): string {
  return format(date, 'MMM d' + (includeYear ? ', yyyy' : ''))
}

export function formatPercent(value: number | undefined): string {
  return value?.toLocaleString('en-US', { style: 'percent' }) ?? '—'
}