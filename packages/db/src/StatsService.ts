import {
  GameId,
  PlaythroughService,
  SimpleStatsService,
  StatsQuery,
  StatsResultData
} from '@gamekeeper/core'
import { DataService } from './DataService'


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


// stats service
// TODO: implement winrates
export class DbStatsService extends SimpleStatsService {

  public constructor(
    private _dataService: DataService,
    playthroughService: PlaythroughService
  ) {
    super(playthroughService)
  }

  public override async getNumPlays({ gameId, year }: StatsQuery = {}): Promise<StatsResultData<number>> {
    
    // create base query
    let query = `
      SELECT
        p.game_id as gameId,
        count(*) as numPlays
      FROM playthroughs p
    `

    // add to query based on params
    const conditions: string[] = []
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
    const dateRange = year ? this.getDateRangeFromYear(year) : undefined

    // run query and store result
    const dtos = await this._dataService.all<NumPlaysPerGameDto>(query, {
      ':game_id': gameId,
      ':from_date': dateRange?.fromDate.toISOString(),
      ':to_date': dateRange?.toDate.toISOString()
    })

    // convert to records
    const result: StatsResultData<number> = {}
    for (const dto of dtos) {
      result[dto.gameId.toString() as GameId] = dto.numPlays
    }

    // return
    return result
  }

  public override async getLastPlayed({ gameId, year }: StatsQuery = {}): Promise<StatsResultData<Date | undefined>> {
    // create base query
    let query = `
      SELECT
        p.game_id as gameId,
        max(p.played_on) as lastPlay
      FROM playthroughs p
    `

    // add to query based on params
    const conditions: string[] = []
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
    const dateRange = year ? this.getDateRangeFromYear(year) : undefined

    // run query and store result
    const dtos = await this._dataService.all<LastPlayPerGameDto>(query, {
      ':game_id': gameId,
      ':from_date': dateRange?.fromDate.toISOString(),
      ':to_date': dateRange?.toDate.toISOString()
    })

    // convert to records
    const result: StatsResultData<Date> = {}
    for (const dto of dtos) {
      result[dto.gameId.toString() as GameId] = new Date(dto.lastPlay)
    }

    // return
    return result
  }

  public override async getNumPlaysByMonth({ gameId, year }: StatsQuery = {}): Promise<number[]> {
    let query = `
      SELECT
        strftime('%m', p.played_on) AS month,
        COUNT(p.id) AS numPlays
      FROM playthroughs p
      JOIN games g ON p.game_id = g.id
    `

    // add to query based on params
    const conditions: string[] = []
    if (gameId) {
      conditions.push('p.game_id = :game_id')
    }
    if (year) {
      conditions.push(`strftime('%Y', p.played_on) = :year`)
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

}