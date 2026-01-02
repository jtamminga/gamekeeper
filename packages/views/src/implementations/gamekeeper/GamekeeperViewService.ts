import { SummaryView, GameView, GamesView, PlaythroughsView, PlaythroughView, PlayerView } from '@def/views'
import { FormatPlaythroughOptions } from '@def/models'
import { ViewService } from '@def/ViewService'
import { GameId, GameKeeper, PlayerId, PlaythroughId, PlaythroughQueryOptions } from '@gamekeeper/core'
import { SummaryViewFactory } from './SummaryViewFactory'
import { GameViewFactory } from './GameViewFactory'
import { GamesViewFactory } from './GamesViewFactory'
import { PlaythroughsViewFactory } from './PlaythroughsViewFactory'
import { PlaythroughViewFactory } from './PlaythroughViewFactory'
import { PlayerViewFactory } from './PlayerViewFactory'

export class GamekeeperViewService implements ViewService {

  private summaryViewFactory: SummaryViewFactory
  private gameViewFactory: GameViewFactory
  private gamesViewFactory: GamesViewFactory
  private playthroughsViewFactory: PlaythroughsViewFactory
  private playthroughViewFactory: PlaythroughViewFactory
  private playerViewFactory: PlayerViewFactory

  public constructor(gamekeeper: GameKeeper) {
    this.summaryViewFactory = new SummaryViewFactory(gamekeeper)
    this.gameViewFactory = new GameViewFactory(gamekeeper)
    this.gamesViewFactory = new GamesViewFactory(gamekeeper)
    this.playthroughsViewFactory = new PlaythroughsViewFactory(gamekeeper)
    this.playthroughViewFactory = new PlaythroughViewFactory(gamekeeper)
    this.playerViewFactory = new PlayerViewFactory(gamekeeper)
  }

  public getSummaryView(year?: number): Promise<SummaryView> {
    return this.summaryViewFactory.create(year)
  }

  public getGameView(id: GameId): Promise<GameView> {
    return this.gameViewFactory.create(id)
  }

  public getGamesView(): Promise<GamesView> {
    return this.gamesViewFactory.create()
  }

  public getPlaythroughsView(options: PlaythroughQueryOptions, formatOptions: FormatPlaythroughOptions): Promise<PlaythroughsView> {
    return this.playthroughsViewFactory.create(options, formatOptions)
  }

  public getPlaythroughView(id: PlaythroughId): PlaythroughView {
    return this.playthroughViewFactory.create(id)
  }

  public getPlayerView(id: PlayerId, year?: number): Promise<PlayerView> {
    return this.playerViewFactory.create(id, year)
  }
  
}