import { FormattedWinStreakForGame, FormattedBestWinStreaks } from '@def/models'
import { ArrayUtils, Game, Players, PlayerWinStreakData } from '@gamekeeper/core'
import { formatDate } from './formatDate'


function formatCurrentStreak(winStreak: PlayerWinStreakData, players: Players) {
  return {
    playerId: winStreak.playerId,
    playerName: players.get(winStreak.playerId).name,
    streak: winStreak.currentStreak
  }
}

function formatBestStreak(streak: PlayerWinStreakData, players: Players) {
  return {
    playerId: streak.playerId,
    playerName: players.get(streak.playerId).name,
    streak: streak.bestStreak,
    startDate: streak.bestStart ? formatDate(streak.bestStart, false) : undefined
  }
}

export function formatBestWinStreaks(winStreaks: PlayerWinStreakData[], players: Players): FormattedBestWinStreaks {
  const bestCurrent = ArrayUtils.best(winStreaks, (a, b) => a.currentStreak > b.currentStreak ? a : b)
  const best = ArrayUtils.best(winStreaks, (a, b) => a.bestStreak > b.bestStreak ? a : b)

  return {
    bestCurrentStreak: formatCurrentStreak(bestCurrent, players),
    bestStreak: formatBestStreak(best, players)
  }
}

export function formatWinStreakForGame(winStreak: PlayerWinStreakData, game: Game, players: Players): FormattedWinStreakForGame {
  return {
    ...formatCurrentStreak(winStreak, players),
    gameId: game.id,
    gameName: game.name,
  }
}