import { ConsoleLogger, type Services } from '@services'
import { Gameplay } from '@domains/gameplay'
import { Insights } from '@domains/insights'
import { ServiceRepository } from '@repos'
import type { GameKeeper } from './GameKeeper'


// factory
export namespace GameKeeperFactory {
  export function create(services: Services): GameKeeper {

    // create other dependencies
    const logger = new ConsoleLogger(process.env.NODE_ENV === 'production')
    const repo = new ServiceRepository(services, logger)

    // finally create game keeper
    const gameplay = new Gameplay({ logger, repo })
    const insights = new Insights({ gameplay, logger, service: services.statsService })

    return { gameplay, insights }
  }
}