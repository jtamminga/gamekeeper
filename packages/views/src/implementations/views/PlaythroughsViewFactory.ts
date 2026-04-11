import { GameKeeper, PlaythroughQueryOptions } from '@gamekeeper/core'
import { PlaythroughsView } from '@def/views'
import { FormatPlaythroughOptions } from '@def/models'
import { formatPlaythroughs } from '../formatters'


const MAX_PLAYTHROUGHS = 100


export class PlaythroughsViewFactory {
  public constructor(
    private readonly gamekeeper: GameKeeper
  ) { }
  
  public async create(options: PlaythroughQueryOptions, formatOptions: FormatPlaythroughOptions): Promise<PlaythroughsView> {
    const playthroughs = await this.gamekeeper.gameplay.playthroughs
      .hydrate({ limit: MAX_PLAYTHROUGHS, ...options })

    const game = options.gameId
      ? this.gamekeeper.gameplay.games.get(options.gameId)
      : undefined

    const roundBased = game?.roundBased

    return {
      game,
      playthroughs: formatPlaythroughs(
        playthroughs.all(options),
        {roundBased, ...formatOptions}
      )
    }
  }
}