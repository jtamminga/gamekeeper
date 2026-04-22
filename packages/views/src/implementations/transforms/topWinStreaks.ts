import { FormattedWinStreakForGame } from '@def/models'
import { ArrayUtils, Players, PlayerWinStreakData, StatsResult } from '@gamekeeper/core'
import { formatWinStreakForGame } from '../formatters'

export function topCurrentWinStreaksForGame(winStreaks: StatsResult<PlayerWinStreakData[]>, players: Players): FormattedWinStreakForGame[] {
  return [...winStreaks.entries()]
    .filter(([_, streaks]) => streaks.length > 0) // filter out games with no streaks
    .map(([game, streaks]) => {
      const best = ArrayUtils.best(streaks, (a, b) => a.currentStreak > b.currentStreak ? a : b)
      return formatWinStreakForGame(best, game, players)
    })
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5)
}