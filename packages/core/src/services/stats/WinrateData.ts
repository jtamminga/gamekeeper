import type { PlayerId, PlaythroughId } from '@services'


export type WinrateData = {
  winrate: number
  plays: number
}

export type PlayerWinrateData = WinrateData & {
  playerId: PlayerId
}

export type CoopWinratesData = {
  game: WinrateData
  players: WinrateData
  winrates: PlayerWinrateData[]
}

export type ScoreStatData = {
  playthroughId: PlaythroughId
  score: number
  playerId?: PlayerId
}

export type ScoreStatsData = {
  highScore: ScoreStatData
  lowScore: ScoreStatData
  averageScore: number
}

export type PlayStreakData = { bestStreak: number, bestStart?: Date, currentStreak: number }

export type PlaysByDateData = { date: Date, plays: number }
