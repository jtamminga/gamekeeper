import {
  GameId,
  NewBasePlaythroughData,
  NewCoopPlaythroughData,
  NewPlaythroughData,
  NewVsPlaythroughData,
  PlayerId,
  PlaythroughQueryOptions,
  ScoreData
} from '@gamekeeper/core'
import { Request } from 'express'


export type ApiPlaythroughDto = {
  gameId: GameId
  playerIds: ReadonlyArray<PlayerId>
  playedOn: string
  winnerId?: PlayerId
  scores?: ReadonlyArray<ScoreData>
  playersWon?: boolean
  score?: number
}

export function toPlaythroughData(dto: ApiPlaythroughDto): NewPlaythroughData {
  const baseData: NewBasePlaythroughData = {
    gameId: dto.gameId,
    playerIds: dto.playerIds,
    playedOn: new Date(dto.playedOn)
  }

  if (dto.winnerId !== undefined) {
    const vsData: NewVsPlaythroughData = {
      ...baseData,
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

export function toPlaythroughQueryOptions(req: Request): PlaythroughQueryOptions {
  const {limit, fromDate, toDate, gameId} = req.query
  
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

  return query
}