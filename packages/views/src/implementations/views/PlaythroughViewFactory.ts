import { PlaythroughView } from '@def/views'
import { GameKeeper, PlaythroughId } from '@gamekeeper/core'
import { formatPlaythrough } from '../formatters'


export class PlaythroughViewFactory {
  public constructor(
    private readonly gamekeeper: GameKeeper
  ) { }

  public create(id: PlaythroughId): PlaythroughView {
    const playthrough = this.gamekeeper.gameplay.playthroughs.get(id)

    const formattedPlaythrough = formatPlaythrough(playthrough, { scores: true, notes: true })

    return {
      ...formattedPlaythrough,
      players: playthrough.players.map(player => ({ id: player.id, name: player.name })),
      game: playthrough.game.name
    }
  }
}