import {
  GameKeeper,
  isCoopStatsData,
  isVsStatsData,
  StatsData
} from 'gamekeeper-core'


// utils
export namespace Utils {

  export type WinrateData = {
    winner: string
    winrate: string
  }

  export function winrate(stats: StatsData, gamekeeper: GameKeeper): WinrateData {
    if (isCoopStatsData(stats)) {
      return {
        winner: 'players',
        winrate: Math.round(stats.playersWinrate * 100) + '%'
      }
    }
    else if (isVsStatsData(stats)) {
      const { playerId, winrate } = stats.bestWinrate!
      const player = gamekeeper.players.get(playerId)
      return {
        winner: player.name,
        winrate: Math.round(winrate * 100) + '%'
      }
    }
    else {
      throw new Error('unsupported game type')
    }
  }

}