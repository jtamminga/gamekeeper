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

}