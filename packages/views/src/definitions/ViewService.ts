import { GameId } from '@gamekeeper/core'
import { GamesView, GameView, SummaryView } from './views'

export interface ViewService {
  getSummaryView(): Promise<SummaryView>
  getGameView(id: GameId): Promise<GameView>
  getGamesView(): Promise<GamesView>
  // getPlaythroughsView(options: PlaythroughQueryOptions): Promise<HydratedPlaythroughsView>
}