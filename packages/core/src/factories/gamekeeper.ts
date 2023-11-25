import { GameKeeper, Store } from '@domains'
import { ConsoleLogger, StatsService, type Services, SimpleStatsService } from '@services'


// types
export type ExternalServices = Omit<Services, 'statsService'> & {
  statsService?: StatsService
}


// factory
export namespace GameKeeperFactory {
  export function create(externalServices: ExternalServices) {

    // external services
    // use simple stats service if no other is specified
    const services: Services = {
      ...externalServices,
      statsService: externalServices.statsService
        ? externalServices.statsService
        : new SimpleStatsService(externalServices.playthroughService)
    }

    // create other dependencies
    const logger = new ConsoleLogger()
    const store = new Store(services, logger)

    // finally create game keeper
    return new GameKeeper({ services, store, logger })
  }
}