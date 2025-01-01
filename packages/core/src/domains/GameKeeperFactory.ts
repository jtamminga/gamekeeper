import { ConsoleLogger, type Services } from '@services'
import { Gameplay } from '@domains/gameplay'
import { Insights } from '@domains/insights'
import { MemoryGameplayRepository, MemoryInsightsRepository } from '@repos'
import type { GameKeeper } from './GameKeeper'


// factory
export namespace GameKeeperFactory {
  export function create(services: Services): GameKeeper {

    // create other dependencies
    const logger = new ConsoleLogger(process.env.NODE_ENV === 'production')

    const gameplayRepo = new MemoryGameplayRepository(services, logger)
    const gameplay = new Gameplay({ logger, repo: gameplayRepo })

    const insightsRepo = new MemoryInsightsRepository(gameplay, services, logger)
    const insights = new Insights({ gameplay, logger, service: services.statsService, repo: insightsRepo })

    return { gameplay, insights }
  }
}