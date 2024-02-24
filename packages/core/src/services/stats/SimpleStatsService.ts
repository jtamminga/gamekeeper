import type { PlayerId } from '../player'
import { GameType, type GameId } from '../game'
import type { PlaythroughDto, PlaythroughQueryOptions, PlaythroughService } from '../playthrough'
import type { StatsQuery, StatsResultData, StatsService, WinrateDto } from './StatsService'
import { endOfYear } from 'date-fns'


/**
 * Simple implementation using the playthrough service
 */
export class SimpleStatsService implements StatsService {

  // TODO: add some playthrough caching

  public constructor(
    private _playthroughService: PlaythroughService
  ) { }

  public async getNumPlays(query: StatsQuery = {}): Promise<StatsResultData<number>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs.length)
  }

  public async getWinrates(query: StatsQuery = {}): Promise<StatsResultData<WinrateDto[]>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => {

      // 1. store for each player how many plays and wins they got
      const allStats = new Map<PlayerId, {plays: number, wins: number}>()
      for (const playthrough of playthroughs) {
        
        // a. set/update play for each player in this playthrough
        playthrough.players.forEach(playerId => {
          const playerStats = allStats.get(playerId)
          if (playerStats) {
            playerStats.plays++
          } else {
            allStats.set(playerId, {wins: 0, plays: 1})
          }
        })

        // b. update wins count based on playthrough result
        // make sure to check if result is a string (it can be null which means a tie)
        if (playthrough.gameType === GameType.VS && typeof playthrough.result === 'string') {
          const playerId = playthrough.result
          const stats = allStats.get(playerId)!
          stats.wins++
        }
        // make sure to check if result equal to true (it can be null which means a tie)
        else if (playthrough.gameType === GameType.COOP) {
          const playersWon = playthrough.result === true
          if (playersWon) {
            playthrough.players.forEach(playerId => {
              allStats.get(playerId)!.wins++
            })
          }
        }
      }

      // 2. once all plays and wins are counted then we calculate winrates for each player
      const winrates: WinrateDto[] = []
      for (const [playerId, stats] of allStats) {
        winrates.push({ playerId, winrate: stats.wins / stats.plays })
      }

      return winrates
    })
  }

  public async getLastPlayed(query: StatsQuery = {}): Promise<StatsResultData<Date | undefined>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs[0]?.playedOn)
  }

  public async getNumPlaysByMonth(query: StatsQuery = {}): Promise<number[]> {
    const playthroughs = await this.getPlaythroughs(query)
    const groupedByMonth: number[] = []
    for (const playthrough of playthroughs) {
      const monthPlayed = playthrough.playedOn.getMonth()
      groupedByMonth[monthPlayed] = (groupedByMonth[monthPlayed] ?? 0) + 1
    }
    return groupedByMonth
  }


  //
  // protected and private
  // =====================


  protected getDateRangeFromYear(year: number): { fromDate: Date, toDate: Date } {
    const fromDate = new Date(year, 0, 1)
    return {
      fromDate,
      toDate: endOfYear(fromDate)
    }
  }

  private async getPlaythroughs({ gameId, year }: StatsQuery): Promise<readonly PlaythroughDto[]> {
    let query: PlaythroughQueryOptions  = { gameId }

    // add date range to query if year is specified
    if (year !== undefined) {
      const dateRange = this.getDateRangeFromYear(year)
      query = { ...query, ...dateRange }
    }
    
    const playthroughs = await this._playthroughService.getPlaythroughs(query)
    return playthroughs
  }

  private groupedByGame(playthroughs: ReadonlyArray<PlaythroughDto>): Record<GameId, PlaythroughDto[]> {
    const grouped: Record<GameId, PlaythroughDto[]> = {}

    for (const playthrough of playthroughs) {
      const group = grouped[playthrough.gameId]
      
      if (group) {
        group.push(playthrough)
      }
      else {
        grouped[playthrough.gameId] = [playthrough]
      }
    }

    return grouped
  }

  private forEachGroup<TOut>(
    grouped: Record<GameId, PlaythroughDto[]>,
    reduce: (group: PlaythroughDto[]) => TOut
  ): StatsResultData<TOut> {

    const result: StatsResultData<TOut> = {}
    for (const id in grouped) {
      const gameId = id as GameId
      const group = grouped[gameId]
      result[gameId] = reduce(group)
    }

    return result
  }

}