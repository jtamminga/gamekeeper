import { ConsoleLogger, type Services } from '@services'
import { Gameplay } from '@domains/gameplay'
import { Insights } from '@domains/insights'
import { MemoryGameplayRepository, MemoryInsightsRepository } from '@repos'
import type { GameKeeper } from './GameKeeper'


/**
 * Factory for constructing a fully wired `GameKeeper` instance.
 * Assembles the repositories, services, and aggregate roots for both
 * bounded contexts (Gameplay and Insights).
 */
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