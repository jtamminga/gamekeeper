import { GameKeeper } from '@domains'
import { HydratableView } from './HydratableView'
import { FormattedPlaythroughs, formatPlaythroughs } from './FormattedPlaythroughs'
import { PlaythroughQueryOptions } from '@services'
import { Game } from '@domains/gameplay'


export interface HydratedPlaythroughsView {
  readonly playthroughs: FormattedPlaythroughs
}


const MAX_PLAYTHROUGHS = 100


export class PlaythroughsView implements HydratableView<HydratedPlaythroughsView> {

  public constructor(
    private readonly gamekeeper: GameKeeper,
    private readonly options: PlaythroughQueryOptions,
  ) { }

  public get game(): Game | undefined {
    const { gameId } = this.options
    if (gameId === undefined) {
      return undefined
    }

    return this.gamekeeper.gameplay.games.get(gameId)
  }
  
  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedPlaythroughsView> {
    const playthroughs = await gamekeeper.gameplay.playthroughs
      .hydrate({ limit: MAX_PLAYTHROUGHS, ...this.options })

    return {
      playthroughs: formatPlaythroughs(
        playthroughs.all(this.options),
        { gameNames: true }
      )
    }
  }
}