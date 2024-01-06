import type { PlayerId } from '../player'
import { GameType, type GameId } from '../game'
import type { PlaythroughDto, PlaythroughQueryOptions, PlaythroughService } from '../playthrough'
import type { StatsQuery, StatsResult, StatsService, WinrateDto } from './StatsService'
import { endOfYear } from 'date-fns'


/**
 * Simple implementation using the playthrough service
 */
export class SimpleStatsService implements StatsService {

  // TODO: add some playthrough caching

  public constructor(
    private _playthroughService: PlaythroughService
  ) { }

  public async getNumPlaythroughs(query: StatsQuery): Promise<StatsResult<number>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs.length)
  }

  public async getWinrates(query: StatsQuery): Promise<StatsResult<WinrateDto[]>> {
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
        if (playthrough.gameType === GameType.VS) {
          const playerId = playthrough.result as PlayerId
          const stats = allStats.get(playerId)!
          stats.wins++
        }
        else if (playthrough.gameType === GameType.COOP) {
          const playersWon = playthrough.result as boolean
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

  public async getLastPlaythroughs(query: StatsQuery): Promise<StatsResult<Date | undefined>> {
    const playthroughs = await this.getPlaythroughs(query)
    const grouped = this.groupedByGame(playthroughs)
    return this.forEachGroup(grouped, playthroughs => playthroughs[0]?.playedOn)
  }

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
  ): StatsResult<TOut> {

    const result: StatsResult<TOut> = {}
    for (const id in grouped) {
      const gameId = id as GameId
      const group = grouped[gameId]
      result[gameId] = reduce(group)
    }

    return result
  }

}