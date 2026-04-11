import {
  GameId,
  GameType,
  StatsQuery,
  StatPerGame,
  HistoricalScoreData,
  InMemoryStats,
  DateUtils
} from '@gamekeeper/core'
import { DataService } from './DataService'
import { DbInMemoryStatsService } from './DbInMemoryStatsService'
import { DbPlaythroughService } from './PlaythroughService'
import { UserId, whereUserId } from './User'
import { parseVsScores } from './scores'


// types
type NumPlaysPerGameDto = {
  gameId: number
  numPlays: number
}
type LastPlayPerGameDto = {
  gameId: number
  lastPlay: string
}
type NumPlaysPerMonthDto = {
  month: string
  numPlays: number
}
type HistoricalScoreRowDto = {
  gameId: number
  gameType: GameType
  scores: string
}


// stats service
export class DbStatsService extends DbInMemoryStatsService {

  public constructor(
    private _dataService: DataService,
    inMemoryStats: InMemoryStats,
    playthroughService: DbPlaythroughService
  ) {
    super(inMemoryStats, playthroughService)
  }

  public override async getNumPlays({ gameId, year }: StatsQuery = {}, userId?: UserId): Promise<StatPerGame<number>> {
    
    // create base query
    let query = `
      SELECT
        p.game_id as gameId,
        count(*) as numPlays
      FROM playthroughs p
    `

    // add to query based on params
    const conditions = [`p.${whereUserId(userId, ':user_id')}`]
    if (gameId) {
      conditions.push('p.game_id = :game_id')
    }
    if (year) {
      conditions.push('p.played_on BETWEEN :from_date AND :to_date')
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    // group by game
    query += ' GROUP BY p.game_id'

    // get date range if year is specified
    const dateRange = year ? DateUtils.getDateRangeFromYear(year) : undefined

    // run query and store result
    const dtos = await this._dataService.all<NumPlaysPerGameDto>(query, {
      ':game_id': gameId,
      ':from_date': dateRange?.fromDate.toISOString(),
      ':to_date': dateRange?.toDate.toISOString(),
      ':user_id': userId
    })

    // convert to records
    const result: StatPerGame<number> = {}
    for (const dto of dtos) {
      result[dto.gameId.toString() as GameId] = dto.numPlays
    }

    // return
    return result
  }

  public override async getLastPlayed({ gameId, year }: StatsQuery = {}, userId?: UserId): Promise<StatPerGame<Date | undefined>> {
    // create base query
    let query = `
      SELECT
        p.game_id as gameId,
        max(p.played_on) as lastPlay
      FROM playthroughs p
    `

    // add to query based on params
    const conditions = [`p.${whereUserId(userId, ':user_id')}`]
    if (gameId) {
      conditions.push('p.game_id = :game_id')
    }
    if (year) {
      conditions.push('p.played_on BETWEEN :from_date AND :to_date')
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    // group by game
    query += ' GROUP BY p.game_id'

    // get date range if year is specified
    const dateRange = year ? DateUtils.getDateRangeFromYear(year) : undefined

    // run query and store result
    const dtos = await this._dataService.all<LastPlayPerGameDto>(query, {
      ':game_id': gameId,
      ':from_date': dateRange?.fromDate.toISOString(),
      ':to_date': dateRange?.toDate.toISOString(),
      ':user_id': userId
    })

    // convert to records
    const result: StatPerGame<Date> = {}
    for (const dto of dtos) {
      result[dto.gameId.toString() as GameId] = new Date(dto.lastPlay)
    }

    // return
    return result
  }

  public override async getNumPlaysByMonth({ gameId, year }: StatsQuery = {}, userId?: UserId): Promise<number[]> {
    let query = `
      SELECT
        strftime('%m', p.played_on, 'localtime') AS month,
        COUNT(p.id) AS numPlays
      FROM playthroughs p
      JOIN games g ON p.game_id = g.id
    `

    // add to query based on params
    const conditions = [`p.${whereUserId(userId, ':user_id')}`]
    if (gameId) {
      conditions.push('p.game_id = :game_id')
    }
    if (year) {
      conditions.push(`strftime('%Y', p.played_on, 'localtime') = :year`)
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' GROUP BY month'

    // run query and store result
    // example:
    //   month | numPlays
    //   '01'  | 10
    //   '02'  | 2
    const dtos = await this._dataService.all<NumPlaysPerMonthDto>(query, {
      ':game_id': gameId,
      ':year': year?.toString(),
      ':user_id': userId
    })

    // change to map, key representing month (0 based), value representing num plays
    const month = new Map<number, number>()
    for (const dto of dtos) {
      month.set(Number.parseInt(dto.month) - 1, dto.numPlays)
    }

    // result represents num plays, index representing months 0 based
    // ex. [0, 10] means Jan has 0 plays, Feb has 10 plays
    const playsByMonth: number[] = []
    for (let i = 0; i < 12; i++) {
      playsByMonth[i] = month.get(i) ?? 0
    }

    return playsByMonth
  }

  public override async getHistoricalScores({ gameId, year, latestPlaythroughs }: StatsQuery = {}, userId?: UserId): Promise<StatPerGame<HistoricalScoreData[]>> {

    // build query
    let query = `
      SELECT
        p.game_id as gameId,
        g.type as gameType,
        p.scores
      FROM playthroughs p
      JOIN games g ON p.game_id = g.id
    `

    const conditions = [
      `p.${whereUserId(userId, ':user_id')}`,
      'p.scores IS NOT NULL'
    ]
    if (gameId) {
      conditions.push('p.game_id = :game_id')
    }
    if (year) {
      conditions.push('p.played_on BETWEEN :from_date AND :to_date')
    }
    query += ' WHERE ' + conditions.join(' AND ')
    query += ' ORDER BY p.played_on DESC'
    if (latestPlaythroughs) {
      query += ' LIMIT :limit'
    }

    const dateRange = year ? DateUtils.getDateRangeFromYear(year) : undefined

    // run query
    const dtos = await this._dataService.all<HistoricalScoreRowDto>(query, {
      ':game_id': gameId,
      ':from_date': dateRange?.fromDate.toISOString(),
      ':to_date': dateRange?.toDate.toISOString(),
      ':user_id': userId,
      ':limit': latestPlaythroughs
    })

    // build result
    const result: StatPerGame<HistoricalScoreData[]> = {}
    for (const dto of dtos) {

      const gameId = dto.gameId.toString() as GameId
      if (!result[gameId]) {
        result[gameId] = []
      }

      if (dto.gameType === GameType.VS) {
        for (const {score, playerId} of parseVsScores(dto.scores)) {
          result[gameId].push({ score, playerId })
        }
      } else {
        result[gameId].push({ score: Number.parseInt(dto.scores) })
      }
    }

    return result
  }

}