import { PlayerId, ScoreData } from '@gamekeeper/core'


export type DbScoreDto = {
  id: string
  s: number
}

export function parseVsScores(scores: string): readonly ScoreData[] {
  const collection = JSON.parse(scores) as DbScoreDto[]
  return collection.map(score => ({ playerId: score.id as PlayerId, score: score.s }))
}

export function serializeVsScores(scores: readonly ScoreData[]): string {
  return JSON.stringify(scores.map<DbScoreDto>(score => ({
    id: score.playerId,
    s: score.score
  })))
}
