import { SummaryView, GameView, GamesView, PlaythroughsView } from '@def/views'
import { ViewService } from '@def/ViewService'
import { GameId, GameKeeper, PlaythroughQueryOptions } from '@gamekeeper/core'
import { GamekeeperSummaryView } from './GamekeeperSummaryView'
import { GamekeeperGameView } from './GamekeeperGameView'
import { GamekeeperGamesView } from './GamekeeperGamesView'
import { GamekeeperPlaythroughsView } from './GamekeeperPlaythroughsView'

export class GamekeeperViewService implements ViewService {

  public constructor(private gamekeeper: GameKeeper) {}

  public async getSummaryView(): Promise<SummaryView> {
    return new GamekeeperSummaryView(this.gamekeeper).hydrate()
  }

  public async getGameView(id: GameId): Promise<GameView> {
    return new GamekeeperGameView(this.gamekeeper, id).hydrate()
  }

  public async getGamesView(): Promise<GamesView> {
    return new GamekeeperGamesView(this.gamekeeper).hydrate()
  }

  public async getPlaythroughsView(options: PlaythroughQueryOptions): Promise<PlaythroughsView> {
    return new GamekeeperPlaythroughsView(this.gamekeeper, options).hydrate()
  }
  
}