import { SummaryView, GameView, GamesView, PlaythroughsView, PlaythroughView } from '@def/views'
import { ViewService } from '@def/ViewService'
import { GameId, GameKeeper, PlaythroughId, PlaythroughQueryOptions } from '@gamekeeper/core'
import { SummaryViewFactory } from './SummaryViewFactory'
import { GameViewFactory } from './GameViewFactory'
import { GamesViewFactory } from './GamesViewFactory'
import { PlaythroughsViewFactory } from './PlaythroughsViewFactory'
import { PlaythroughViewFactory } from './PlaythroughViewFactory'

export class GamekeeperViewService implements ViewService {

  private summaryViewFactory: SummaryViewFactory
  private gameViewFactory: GameViewFactory
  private gamesViewFactory: GamesViewFactory
  private playthroughsViewFactory: PlaythroughsViewFactory
  private playthroughViewFactory: PlaythroughViewFactory

  public constructor(gamekeeper: GameKeeper) {
    this.summaryViewFactory = new SummaryViewFactory(gamekeeper)
    this.gameViewFactory = new GameViewFactory(gamekeeper)
    this.gamesViewFactory = new GamesViewFactory(gamekeeper)
    this.playthroughsViewFactory = new PlaythroughsViewFactory(gamekeeper)
    this.playthroughViewFactory = new PlaythroughViewFactory(gamekeeper)
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

  public getPlaythroughsView(options: PlaythroughQueryOptions): Promise<PlaythroughsView> {
    return this.playthroughsViewFactory.create(options)
  }

  public getPlaythroughView(id: PlaythroughId): PlaythroughView {
    return this.playthroughViewFactory.create(id)
  }
  
}