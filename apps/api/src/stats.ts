import type { GameId, StatsQuery } from '@gamekeeper/core'
import type { Request } from 'express'


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