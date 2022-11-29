import {
  CoopPlaythrough,
  Game,
  isCoopStatsData,
  isVsStatsData,
  Player,
  PlayerMap,
  Playthrough,
  StatsData,
  VsPlaythrough
} from 'gamekeeper-core'


// utils
export namespace Utils {

  export function winner(playthrough: Playthrough, players: PlayerMap): string {
    if (playthrough instanceof CoopPlaythrough) {
      return playthrough.playersWon
        ? 'players'
        : 'game'
    }
    else if (playthrough instanceof VsPlaythrough) {
      return players.get(playthrough.winnerId)!.name
    }
    else {
      throw new Error('unsupported playthrough type')
    }
  }

  export type WinrateData = {
    winner: string
    winrate: string
  }

  export function winrate(stats: StatsData, players: PlayerMap): WinrateData {
    if (isCoopStatsData(stats)) {
      return {
        winner: 'players',
        winrate: Math.round(stats.playersWinrate * 100) + '%'
      }
    }
    else if (isVsStatsData(stats)) {
      const { playerId, winrate } = stats.bestWinrate!
      const player = players.get(playerId)!
      return {
        winner: player.name,
        winrate: Math.round(winrate * 100) + '%'
      }
    }
    else {
      throw new Error('unsupported game type')
    }
  }

  export function playerStats(stats: StatsData, player: Player) {
    
  }

}