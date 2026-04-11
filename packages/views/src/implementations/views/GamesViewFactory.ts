import { GamesView } from '@def/views'
import { GameKeeper, GameType, VsGame } from '@gamekeeper/core'
import { formatDate } from '../formatters'


export class GamesViewFactory {
  public constructor(private gamekeeper: GameKeeper) { }

  public async create(): Promise<GamesView> {
    const [
      numPlays,
      lastPlayed
    ] = await Promise.all([
      this.gamekeeper.insights.stats.numPlaythroughs({}),
      this.gamekeeper.insights.stats.lastPlayed({})
    ])

    const games = this.gamekeeper.gameplay.games.all().map(game => {
      const lastPlayedDate = lastPlayed.get(game)

      return {
        id: game.id,
        name: game.name,
        type: game instanceof VsGame ? GameType.VS : GameType.COOP,
        weight: game.weight,
        numPlays: numPlays.get(game) ?? 0,
        lastPlayed: lastPlayedDate,
        lastPlayedFormatted: lastPlayedDate ? formatDate(lastPlayedDate, true) : undefined
      }
    })

    return {
      games
    }
  }
}