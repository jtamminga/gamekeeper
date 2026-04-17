import type { GameId, PlayerId, PlaythroughId, PlaythroughQueryOptions } from '@gamekeeper/core'
import type { FormatPlaythroughOptions, GameView, GamesView, PlayerView, PlaythroughsView, PlaythroughView, SummaryView, ViewService } from '@gamekeeper/views'
import { Route } from '@gamekeeper/views'
import type { IApiClient } from './IApiClient'
import { encodePlaythroughQuery, encodeFormatOptions } from './queryParams'


export class ApiViewService implements ViewService {

  public constructor(private readonly client: IApiClient) { }

  public getSummaryView(year?: number): Promise<SummaryView> {
    return this.client.get(Route.VIEW.SUMMARY, year ? { year: year.toString() } : undefined)
  }

  public getGamesView(): Promise<GamesView> {
    return this.client.get(Route.VIEW.GAMES)
  }

  public getGameView(id: GameId): Promise<GameView> {
    return this.client.get(Route.forViewGame(id))
  }

  public getPlaythroughsView(options: PlaythroughQueryOptions, formatOptions: FormatPlaythroughOptions): Promise<PlaythroughsView> {
    const query = { ...encodePlaythroughQuery(options), ...encodeFormatOptions(formatOptions) }
    return this.client.get(Route.VIEW.PLAYTHROUGHS, query)
  }

  public getPlaythroughView(id: PlaythroughId): Promise<PlaythroughView> {
    return this.client.get(Route.forViewPlaythrough(id))
  }

  public getPlayerView(id: PlayerId, year?: number): Promise<PlayerView> {
    return this.client.get(Route.forViewPlayer(id), year ? { year: year.toString() } : undefined)
  }

}
