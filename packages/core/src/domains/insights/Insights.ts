import type { InsightsRepository } from '@repos'
import type { GoalsQuery, Logger, StatsService } from '@services'
import type { Gameplay } from '@domains/gameplay'
import { Goals } from './goal'
import { Stats } from './stats'


export type InsightsDeps = {
  logger: Logger
  service: StatsService
  gameplay: Gameplay
  repo: InsightsRepository
}


/**
 * Aggregate root for the Insights bounded context.
 * Coordinates stats and goals. Stats are lazy (queried on demand);
 * goals are hydrated up front since they're used for progress tracking.
 */
export class Insights {

  public readonly stats: Stats
  public readonly goals: Goals

  public constructor(deps: InsightsDeps) {
    this.stats = new Stats(deps)
    this.goals = new Goals(deps)
  }

  public async hydrate(query: GoalsQuery = {}): Promise<void> {
    await this.goals.hydrate(query)
  }

}