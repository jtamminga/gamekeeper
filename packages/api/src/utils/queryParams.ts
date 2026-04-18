import type { GameId, GoalsQuery, PlayerId, PlaythroughQueryOptions, StatsQuery } from '@gamekeeper/core'
import type { FormatPlaythroughOptions } from '@gamekeeper/views'


//
// PlaythroughQueryOptions
//


export function encodePlaythroughQuery(options: PlaythroughQueryOptions): Record<string, string> {
  const query: Record<string, string> = {}
  if (options.limit !== undefined) query.limit = options.limit.toString()
  if (options.fromDate !== undefined) query.fromDate = options.fromDate.toISOString()
  if (options.toDate !== undefined) query.toDate = options.toDate.toISOString()
  if (options.gameId !== undefined) query.gameId = options.gameId
  if (options.year !== undefined) query.year = options.year.toString()
  if (options.playerIds !== undefined) query.playerIds = options.playerIds.join(',')
  return query
}

export function decodePlaythroughQuery(params: Record<string, unknown>): PlaythroughQueryOptions {
  const { limit, fromDate, toDate, gameId, year, playerIds } = params
  const options: PlaythroughQueryOptions = {}
  if (typeof limit === 'string') options.limit = Number.parseInt(limit)
  if (typeof fromDate === 'string') options.fromDate = new Date(fromDate)
  if (typeof toDate === 'string') options.toDate = new Date(toDate)
  if (typeof gameId === 'string') options.gameId = gameId as GameId
  if (typeof year === 'string') options.year = Number.parseInt(year)
  if (typeof playerIds === 'string') options.playerIds = playerIds.split(',') as PlayerId[]
  return options
}


//
// FormatPlaythroughOptions
//


export function encodeFormatOptions(options: FormatPlaythroughOptions): Record<string, string> {
  const query: Record<string, string> = {}
  if (options.gameNames !== undefined) query.gameNames = options.gameNames.toString()
  if (options.scores !== undefined) query.scores = options.scores.toString()
  if (options.notes !== undefined) query.notes = options.notes.toString()
  if (options.hasRoundBasedScoring !== undefined) query.hasRoundBasedScoring = options.hasRoundBasedScoring.toString()
  return query
}

export function decodeFormatOptions(params: Record<string, unknown>): FormatPlaythroughOptions {
  const { gameNames, scores, notes, hasRoundBasedScoring } = params
  const options: FormatPlaythroughOptions = {}
  if (typeof gameNames === 'string') options.gameNames = gameNames === 'true'
  if (typeof scores === 'string') options.scores = scores === 'true'
  if (typeof notes === 'string') options.notes = notes === 'true'
  if (typeof hasRoundBasedScoring === 'string') options.hasRoundBasedScoring = hasRoundBasedScoring === 'true'
  return options
}


//
// StatsQuery
//


export function encodeStatsQuery(query: StatsQuery | undefined): Record<string, string> {
  if (query === undefined) return {}
  const params: Record<string, string> = {}
  if (query.year !== undefined) params.year = query.year.toString()
  if (query.gameId !== undefined) params.gameId = query.gameId
  if (query.latestPlaythroughs !== undefined) params.latestPlaythroughs = query.latestPlaythroughs.toString()
  return params
}

export function decodeStatsQuery(params: Record<string, unknown>): StatsQuery {
  const { year, gameId, latestPlaythroughs } = params
  const query: StatsQuery = {}
  if (typeof year === 'string') query.year = Number.parseInt(year)
  if (typeof gameId === 'string') query.gameId = gameId as GameId
  if (typeof latestPlaythroughs === 'string') query.latestPlaythroughs = Number.parseInt(latestPlaythroughs)
  return query
}


//
// GoalsQuery
//


export function encodeGoalsQuery(query: GoalsQuery): Record<string, string> {
  const params: Record<string, string> = {}
  if (query.year !== undefined) params.year = query.year.toString()
  return params
}

export function decodeGoalsQuery(params: Record<string, unknown>): GoalsQuery {
  const { year } = params
  const query: GoalsQuery = {}
  if (typeof year === 'string') query.year = Number.parseInt(year)
  return query
}
