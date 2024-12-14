import { GameId, PlaythroughQueryOptions } from '@services'
import { HydratedGameView } from './GameView'
import { HydratedStatsView } from './StatsView'
import { HydratedGamesView } from './GamesView'
import { HydratedPlaythroughsView } from './PlaythroughsView'

export interface ViewService {
  getSummaryView(): Promise<HydratedStatsView>
  getGameView(id: GameId): Promise<HydratedGameView>
  getGamesView(): Promise<HydratedGamesView>
  // getPlaythroughsView(options: PlaythroughQueryOptions): Promise<HydratedPlaythroughsView>
}