import { PlaythroughView } from '@def/views'
import { GameKeeper, PlaythroughId } from '@gamekeeper/core'
import { formatPlaythrough } from '../formatters'


export class PlaythroughViewFactory {
  public constructor(
    private readonly gamekeeper: GameKeeper
  ) { }

  public create(id: PlaythroughId): PlaythroughView {
    const playthrough = this.gamekeeper.gameplay.playthroughs.get(id)

    const formattedPlaythrough = formatPlaythrough(playthrough, { scores: true })

    return {
      ...formattedPlaythrough,
      game: playthrough.game.name
    }
  }
}