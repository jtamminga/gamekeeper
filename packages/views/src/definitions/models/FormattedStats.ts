import type { HistoricalScoreData, PlayerId, PlaythroughId } from '@gamekeeper/core'

export interface FormattedStat {
  name: string
  hasStats: boolean
  valueAllTime: string
  valueThisYear: string
}
export interface FormattedPlayerStat extends FormattedStat {
  playerId: PlayerId
  numPlaysAllTime: number
  numPlaysThisYear: number
}
export type FormattedScoreStats = {
  average: string
  best: { playthroughId: PlaythroughId, score: string, player?: string, playerId?: PlayerId }
  worst: { playthroughId: PlaythroughId, score: string, player?: string, playerId?: PlayerId }
  historicalScores: ReadonlyArray<HistoricalScoreData>
}