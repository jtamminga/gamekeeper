import { SummaryView, GameView, GamesView, PlaythroughsView } from '@def/views'
import { ViewService } from '@def/ViewService'
import { GameId, GameKeeper, PlaythroughQueryOptions } from '@gamekeeper/core'
import { SummaryViewFactory } from './SummaryViewFactory'
import { GameViewFactory } from './GameViewFactory'
import { GamesViewFactory } from './GamesViewFactory'
import { PlaythroughsViewFactory } from './PlaythroughsViewFactory'

export class GamekeeperViewService implements ViewService {

  private summaryViewFactory: SummaryViewFactory
  private gameViewFactory: GameViewFactory
  private gamesViewFactory: GamesViewFactory
  private playthroughsViewFactory: PlaythroughsViewFactory

  public constructor(gamekeeper: GameKeeper) {
    this.summaryViewFactory = new SummaryViewFactory(gamekeeper)
    this.gameViewFactory = new GameViewFactory(gamekeeper)
    this.gamesViewFactory = new GamesViewFactory(gamekeeper)
    this.playthroughsViewFactory = new PlaythroughsViewFactory(gamekeeper)
  }

  public async getSummaryView(year?: number): Promise<SummaryView> {
    return this.summaryViewFactory.create(year)
  }

  public async getGameView(id: GameId): Promise<GameView> {
    return this.gameViewFactory.create(id)
  }

  public async getGamesView(): Promise<GamesView> {
    return this.gamesViewFactory.create()
  }

  public async getPlaythroughsView(options: PlaythroughQueryOptions): Promise<PlaythroughsView> {
    return this.playthroughsViewFactory.create(options)
  }
  
}