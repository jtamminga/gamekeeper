import { GameKeeper, Store } from '@domains'
import { Services } from '@services'


// factory
export namespace GameKeeperFactory {
  export function create(services: Services) {

    const store = new Store(services)

    return new GameKeeper({ services, store })
  }
}