import { GameKeeper, Store } from '@domains'
import { ConsoleLogger, type Services } from '@services'


// factory
export namespace GameKeeperFactory {
  export function create(services: Services) {

    // create other dependencies
    const logger = new ConsoleLogger(process.env.NODE_ENV === 'production')
    const store = new Store(services, logger)

    // finally create game keeper
    return new GameKeeper({ services, store, logger })
  }
}