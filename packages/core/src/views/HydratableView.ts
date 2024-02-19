import { GameKeeper } from '@domains'

export interface HydratableView<T> {

  hydrate(gamekeeper: GameKeeper): Promise<T>

}