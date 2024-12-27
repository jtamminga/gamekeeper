import { ViewService } from '@gamekeeper/views'
import { ResultHandler } from './ResultHandler'


export class ViewGenerator {
  public constructor(
    private readonly viewService: ViewService,
    private readonly resultHandler: ResultHandler
  ) {}

  public async generate(): Promise<void> {
    const summaryView = await this.viewService.getSummaryView()
    await this.resultHandler.handle('summary', summaryView)

    const gamesView = await this.viewService.getGamesView()
    await this.resultHandler.handle('games', gamesView)

    for (const game of gamesView.games) {
      const gameView = await this.viewService.getGameView(game.id)
      await this.resultHandler.handle(`game-${game.id}`, gameView)
    }
  }
}