import { GameId, PlayerId, StatsQuery, StatsService, WinrateDto, WinstreakDto } from '@gamekeeper/core'
import { ApiService } from 'ApiService'


// stats service
export class ApiStatsService extends ApiService implements StatsService {

  getNumPlaythroughs(gameId: GameId, query: StatsQuery): Promise<number> {
    throw new Error('Method not implemented.')
  }

  getWinrate(gameId: GameId, playerId: PlayerId, query: StatsQuery): Promise<number> {
    throw new Error('Method not implemented.')
  }

  getWinrates(gameId: GameId, query: StatsQuery): Promise<readonly WinrateDto[]> {
    throw new Error('Method not implemented.')
  }

  getLastPlaythrough(gameId: GameId, query: StatsQuery): Promise<Date | undefined> {
    throw new Error('Method not implemented.')
  }

  getWinstreaks(gameId: GameId, query: StatsQuery): Promise<readonly WinstreakDto[]> {
    throw new Error('Method not implemented.')
  }

}