import {
  ArrayUtils,
  GameId,
  PlayerId,
  PlaythroughDto,
  PlaythroughId,
  PlaythroughService,
  StatsQuery,
  StatsService,
  WinrateDto,
  WinstreakDto
} from 'core'


// stats service
export class DbStatsService implements StatsService {

  private _playthroughsByYear: Map<number, readonly PlaythroughDto[]>

  public constructor(
    private _playthroughService: PlaythroughService
  ) { 
    this._playthroughsByYear = new Map<number, readonly PlaythroughDto[]>()
  }

  public async getNumPlaythroughs(gameId: GameId, query: StatsQuery): Promise<number> {
    return (await this.getPlaythroughsByGame(gameId, query)).length
  }

  public async getWinrate(gameId: GameId, playerId: PlayerId, query: StatsQuery): Promise<number> {
    return 0
  }

  public async getWinrates(gameId: GameId, query: StatsQuery): Promise<readonly WinrateDto[]> {
    return []
  }

  public async getLastPlaythrough(gameId: GameId, query: StatsQuery): Promise<Date | undefined> {
    return (await this.getPlaythroughsByGame(gameId, query))[0]?.playedOn
  }

  public async getWinstreaks(gameId: GameId, query: StatsQuery): Promise<readonly WinstreakDto[]> {
    return []
  }

  private async getPlaythroughs({ year }: StatsQuery): Promise<readonly PlaythroughDto[]> {
    let playthroughs = this._playthroughsByYear.get(year)
    if (playthroughs) {
      return playthroughs
    }

    playthroughs = await this._playthroughService.getPlaythroughs()
    this._playthroughsByYear.set(year, playthroughs)
    return playthroughs
  }

  private async getPlaythroughsByGame(gameId: GameId, query: StatsQuery): Promise<readonly PlaythroughDto[]> {
    return (await this.getPlaythroughs(query)).filter(playthrough => playthrough.gameId === gameId)
  }

}