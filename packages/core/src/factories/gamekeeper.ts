import { GameKeeper, Store } from '@domains'
import { ConsoleLogger, type Services } from '@services'


// factory
export namespace GameKeeperFactory {
  export function create(services: Services) {

    const logger = new ConsoleLogger()

    const store = new Store(services, logger)

    return new GameKeeper({ services, store, logger })
  }
}