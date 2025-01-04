import { PlaythroughsView } from '@def/views'
import { GameKeeper, PlaythroughQueryOptions } from '@gamekeeper/core'
import { formatPlaythroughs } from '../formatters'


const MAX_PLAYTHROUGHS = 100


export class PlaythroughsViewFactory {
  public constructor(
    private readonly gamekeeper: GameKeeper,
  ) { }
  
  public async create(options: PlaythroughQueryOptions): Promise<PlaythroughsView> {
    const playthroughs = await this.gamekeeper.gameplay.playthroughs
      .hydrate({ limit: MAX_PLAYTHROUGHS, ...options })

    return {
      game: options.gameId
        ? this.gamekeeper.gameplay.games.get(options.gameId)
        : undefined,
      playthroughs: formatPlaythroughs(
        playthroughs.all(options),
        { gameNames: true }
      )
    }
  }
}