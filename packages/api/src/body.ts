import type {
  GameId,
  NewBasePlaythroughData,
  NewCoopPlaythroughData,
  NewGoalData,
  NewPlaythroughData,
  NewVsPlaythroughData,
  PlayerId,
  ScoreData,
  UpdatedGoalData
} from '@gamekeeper/core'
import { InvalidParamsError } from './InvalidParamsError'


export function decodeNewGoalBody(body: Record<string, unknown>): NewGoalData {
  const { type, value, year } = body

  if (typeof type !== 'number') {
    throw new InvalidParamsError('type is required')
  }
  if (typeof value !== 'number') {
    throw new InvalidParamsError('value is required')
  }
  if (typeof year !== 'number') {
    throw new InvalidParamsError('year is required')
  }

  return { type, value, year }
}

export function decodeUpdatedGoalBody(body: Record<string, unknown>): Omit<UpdatedGoalData, 'id'> {
  const { type, value, year } = body
  const data: Omit<UpdatedGoalData, 'id'> = {}
  if (typeof type === 'number') data.type = type
  if (typeof value === 'number') data.value = value
  if (typeof year === 'number') data.year = year
  return data
}

export function decodeNewPlaythroughBody(body: Record<string, unknown>): NewPlaythroughData {
  const { gameId, playerIds, playedOn, winnerId, scores, playersWon, score, notes, startedOn, endedOn } = body

  const baseData: NewBasePlaythroughData = {
    gameId: gameId as GameId,
    playerIds: playerIds as ReadonlyArray<PlayerId>,
    playedOn: new Date(playedOn as string)
  }
  if (notes) baseData.notes = notes as string
  if (startedOn) baseData.startedOn = new Date(startedOn as string)
  if (endedOn) baseData.endedOn = new Date(endedOn as string)

  if (winnerId !== undefined) {
    const vsData: NewVsPlaythroughData = {
      ...baseData,
      type: 'vs',
      winnerId: winnerId as PlayerId
    }
    if (scores !== undefined) {
      vsData.scores = scores as ReadonlyArray<ScoreData>
    }
    return vsData
  }

  else if (playersWon !== undefined) {
    const coopData: NewCoopPlaythroughData = {
      ...baseData,
      type: 'coop',
      playersWon: playersWon as boolean
    }
    if (score !== undefined) {
      coopData.score = score as number
    }
    return coopData
  }

  else {
    throw new Error('invalid playthrough data')
  }
}
