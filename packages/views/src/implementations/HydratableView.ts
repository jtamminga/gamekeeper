import type { GameKeeper } from '@gamekeeper/core'

export interface HydratableView<T> {

  hydrate(gamekeeper: GameKeeper): Promise<T>

}