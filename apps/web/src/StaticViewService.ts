import { GameId } from '@gamekeeper/core'
import { GamesView, GameView, PlaythroughsView, SummaryView, ViewService } from '@gamekeeper/views'

export class StaticViewService implements ViewService {
  public async getSummaryView(): Promise<SummaryView> {
    return this.fetchJson<SummaryView>('/view-data/summary.json')
  }
  public async getGameView(id: GameId): Promise<GameView> {
    return this.fetchJson<GameView>(`/view-data/game-${id}.json`)
  }
  public async getGamesView(): Promise<GamesView> {
    return await this.fetchJson<GamesView>('/view-data/games.json')
  }
  public async getPlaythroughsView(): Promise<PlaythroughsView> {
    throw new Error('getPlaythroughsView not implemented.')
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const data: T = await response.json()
    return data
  }
}