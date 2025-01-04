import type { GameId, PlaythroughQueryOptions } from '@gamekeeper/core'
import type { GamesView, GameView, PlaythroughsView, SummaryView } from './views'

export interface ViewService {
  getSummaryView(year?: number): Promise<SummaryView>
  getGameView(id: GameId): Promise<GameView>
  getGamesView(): Promise<GamesView>
  getPlaythroughsView(options: PlaythroughQueryOptions): Promise<PlaythroughsView>
}