import { Game, GameKeeper } from '@domains'
import { HydratableView } from './HydratableView'
import { FormattedPlaythroughs, formatPlaythroughs } from './FormattedPlaythroughs'


export interface HydratedAllPlaythroughsView {
  readonly playthroughs: FormattedPlaythroughs
}


const MAX_PLAYTHROUGHS = 100


export class AllPlaythroughsView implements HydratableView<HydratedAllPlaythroughsView> {

  public constructor(public readonly game?: Game) { }
  
  public async hydrate(gamekeeper: GameKeeper): Promise<HydratedAllPlaythroughsView> {
    const playthroughs = await gamekeeper.playthroughs
      .hydrate({ limit: MAX_PLAYTHROUGHS, gameId: this.game?.id })

    return {
      playthroughs: formatPlaythroughs(
        playthroughs.latest(MAX_PLAYTHROUGHS, this.game?.id),
        { gameNames: !this.game, scores: !!this.game }
      )
    }
  }
}