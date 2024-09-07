import type { Gameplay } from './gameplay'
import type { Insights } from './insights'


export interface GameKeeper {
  gameplay: Gameplay
  insights: Insights
}