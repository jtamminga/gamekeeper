import type { FormattedPlayStreak } from '@def/models'
import type { PlayStreakData } from '@gamekeeper/core'
import { formatDate } from './formatDate'


export function formatPlayStreak(data: PlayStreakData): FormattedPlayStreak {
  return {
    bestStreak: data.bestStreak,
    bestStartDate: data.bestStart?.toISOString(),
    bestStartDateFormatted: data.bestStart
      ? formatDate(data.bestStart)
      : undefined,
    currentStreak: data.currentStreak
  }
}