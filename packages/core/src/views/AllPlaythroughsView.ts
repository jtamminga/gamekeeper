import { Game, GameKeeper } from '@domains'
import { HydratableView } from './HydratableView'
import { FormattedPlaythrough, formatPlaythroughs } from './PlaythroughPreview'


export interface HydratedAllPlaythroughsView {
  readonly playthroughs: ReadonlyArray<FormattedPlaythrough>
}


export class AllPlaythroughsView implements HydratableView<HydratedAllPlaythroughsView> {

  public constructor(public readonly game: Game) { }
  
  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedAllPlaythroughsView> {
    const playthroughs = await gamekeeper.playthroughs.hydrate({ limit: 100 })

    return {
      playthroughs: formatPlaythroughs(playthroughs.all(), false)
    }
  }
}