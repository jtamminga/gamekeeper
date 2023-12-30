import { GameId, StatsQuery } from '@gamekeeper/core'
import { Request } from 'express'
import { InvalidParamsError } from './InvalidParamsError'


export function toStatsQuery(req: Request): StatsQuery {
  const { year, gameId } = req.query
  const query: StatsQuery = {}

  if (typeof year === 'string') {
    query.year = Number.parseInt(year)
  }

  if (typeof gameId === 'string') {
    query.gameId = gameId as GameId
  }

  return query
}