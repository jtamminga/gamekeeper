import { Goals } from './goal'
import { Stats } from './stats'
import type { Gameplay } from '@domains/gameplay'
import type { Logger, StatsService } from '@services'


export type InsightsDeps = {
  logger: Logger
  service: StatsService
  gameplay: Gameplay
}


export class Insights {

  public readonly stats: Stats
  public readonly goals: Goals

  public constructor(deps: InsightsDeps) {
    this.stats = new Stats(deps)
    this.goals = new Goals(deps)
  }

}