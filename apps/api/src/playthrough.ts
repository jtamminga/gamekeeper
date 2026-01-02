import {
  GameId,
  NewBasePlaythroughData,
  NewCoopPlaythroughData,
  NewPlaythroughData,
  NewVsPlaythroughData,
  PlayerId,
  PlaythroughId,
  PlaythroughQueryOptions,
  ScoreData} from '@gamekeeper/core'
import { Request } from 'express'


export type ApiNewPlaythroughDto = {
  gameId: GameId
  playerIds: ReadonlyArray<PlayerId>
  playedOn: string
  winnerId?: PlayerId
  scores?: ReadonlyArray<ScoreData>
  playersWon?: boolean
  score?: number
  notes?: string
  startedOn?: string
  endedOn?: string
}

export type ApiUpdatedPlaythroughDto = {
  id: PlaythroughId,
  notes?: string
  startedOn?: string
  endedOn?: string
}


export function toPlaythroughQueryOptions(req: Request): PlaythroughQueryOptions {
  const { limit, fromDate, toDate, gameId, playerIds } = req.query
  
  const query: PlaythroughQueryOptions = {}
  if (typeof limit === 'string') {
    query.limit = Number.parseInt(limit)
  }
  if (typeof fromDate === 'string') {
    query.fromDate = new Date(fromDate)
  }
  if (typeof toDate === 'string') {
    query.toDate = new Date(toDate)
  }
  if (typeof gameId === 'string') {
    query.gameId = gameId as GameId
  }
  if (typeof playerIds === 'string') {
    query.playerIds = playerIds.split(',') as PlayerId[]
  }

  return query
}

export function toNewPlaythroughData(dto: ApiNewPlaythroughDto): NewPlaythroughData {
  const baseData: NewBasePlaythroughData = {
    gameId: dto.gameId,
    playerIds: dto.playerIds,
    playedOn: new Date(dto.playedOn)
  }
  if (dto.notes) {
    baseData.notes = dto.notes
  }
  if (dto.startedOn) {
    baseData.startedOn = new Date(dto.startedOn)
  }
  if (dto.endedOn) {
    baseData.endedOn = new Date(dto.endedOn)
  }

  if (dto.winnerId !== undefined) {
    const vsData: NewVsPlaythroughData = {
      ...baseData,
      type: 'vs',
      winnerId: dto.winnerId
    }
    if (dto.scores !== undefined) {
      vsData.scores = dto.scores
    }
    return vsData
  }

  else if (dto.playersWon !== undefined) {
    const coopData: NewCoopPlaythroughData = {
      ...baseData,
      type: 'coop',
      playersWon: dto.playersWon
    }
    if (dto.score !== undefined) {
      coopData.score = dto.score
    }
    return coopData
  }

  else {
    throw new Error('invalid playthrough data')
  }
}