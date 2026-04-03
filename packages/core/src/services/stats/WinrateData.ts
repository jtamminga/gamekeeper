import type { PlayerId } from '@services'


export type PlayerWinrateData = {
  playerId: PlayerId
  winrate: number
  plays: number
}

export type CoopWinratesData = {
  players: PlayerWinrateData[]
  game: { winrate: number, plays: number }
}

export type ScoreStatData = { score: number, playerId?: PlayerId }

export type ScoreStatsData = {
  highScore: ScoreStatData
  lowScore: ScoreStatData
  averageScore: number
}

export type PlayStreakData = { bestStreak: number, bestStart?: Date, currentStreak: number }

export type PlaysByDateData = { date: Date, plays: number }
