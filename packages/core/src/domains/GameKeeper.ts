import type { Gameplay } from './gameplay'
import type { Insights } from './insights'


/**
 * Top-level entry point for the Gamekeeper domain.
 * Holds the two bounded contexts: `gameplay` for recording games and playthroughs,
 * and `insights` for stats and goals.
 */
export interface GameKeeper {
  gameplay: Gameplay
  insights: Insights
}