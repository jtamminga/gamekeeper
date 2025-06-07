import type { GameId, PlaythroughId, PlaythroughQueryOptions } from '@gamekeeper/core'
import type { GamesView, GameView, PlaythroughsView, PlaythroughView, SummaryView } from './views'
import type { FormatPlaythroughOptions } from './models'

export interface ViewService {
  getSummaryView(year?: number): Promise<SummaryView>
  getGameView(id: GameId): Promise<GameView>
  getGamesView(): Promise<GamesView>
  getPlaythroughsView(options: PlaythroughQueryOptions, formatOptions: FormatPlaythroughOptions): Promise<PlaythroughsView>
  getPlaythroughView(id: PlaythroughId): PlaythroughView
}