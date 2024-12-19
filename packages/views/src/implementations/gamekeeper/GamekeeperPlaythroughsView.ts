import { PlaythroughsView } from '@def/views'
import { HydratableView } from './HydratableView'
import { GameKeeper, PlaythroughQueryOptions } from '@gamekeeper/core'
import { formatPlaythroughs } from '../formatters'


const MAX_PLAYTHROUGHS = 100


export class GamekeeperPlaythroughsView implements HydratableView<PlaythroughsView> {
  public constructor(
    private readonly gamekeeper: GameKeeper,
    private readonly options: PlaythroughQueryOptions,
  ) { }
  
  public async hydrate(): Promise<PlaythroughsView> {
    const playthroughs = await this.gamekeeper.gameplay.playthroughs
      .hydrate({ limit: MAX_PLAYTHROUGHS, ...this.options })

    return {
      game: this.options.gameId
        ? this.gamekeeper.gameplay.games.get(this.options.gameId)
        : undefined,
      playthroughs: formatPlaythroughs(
        playthroughs.all(this.options),
        { gameNames: true }
      )
    }
  }
}