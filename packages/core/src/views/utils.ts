import { CoopPlaythrough, type Playthrough, VsPlaythrough } from '@domains/gameplay'
import { format } from 'date-fns'


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