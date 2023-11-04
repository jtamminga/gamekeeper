import { Store } from '@domains'
import { Services } from '@services'

// type
export type GameKeeperDeps = {
  services: Services
  store: Store
}