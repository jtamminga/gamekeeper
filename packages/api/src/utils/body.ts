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
import { DecodeError, RequiredError } from '../errors'


export function decodeNewGoalBody(body: Record<string, unknown>): NewGoalData {
  const { type, value, year } = body

  // validate
  if (typeof type !== 'number') throw new RequiredError('type')
  if (typeof value !== 'number') throw new RequiredError('value')
  if (typeof year !== 'number') throw new RequiredError('year')

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

  // validate
  if (typeof gameId !== 'string') throw new RequiredError('gameId')
  if (typeof playerIds !== 'object') throw new RequiredError('playerIds')
  if (typeof playedOn !== 'string') throw new RequiredError('playedOn')

  const baseData: NewBasePlaythroughData = {
    gameId: gameId as GameId,
    playerIds: playerIds as ReadonlyArray<PlayerId>,
    playedOn: new Date(playedOn)
  }
  if (typeof notes === 'string') baseData.notes = notes
  if (typeof startedOn === 'string') baseData.startedOn = new Date(startedOn)
  if (typeof endedOn === 'string') baseData.endedOn = new Date(endedOn)

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
    throw new DecodeError('invalid playthrough data')
  }
}
