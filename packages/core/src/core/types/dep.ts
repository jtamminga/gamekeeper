import { Store } from '@domains'
import { Logger, Services } from '@services'


// type
export type GameKeeperDeps = {
  services: Services
  store: Store
  logger: Logger
}