import { GoalData, GoalType } from '@services'
import { Goal } from './Goal'
import { PlaythroughsGoal } from './PlaythroughsGoal'
import { InsightsDeps } from '../Insights'


export namespace GoalFactory {
  export function create(deps: InsightsDeps, data: GoalData): Goal {
    switch (data.type) {
      case GoalType.NumPlays:
        return new PlaythroughsGoal(deps, data)
      default:
        throw new Error(`Unknown goal type: ${data.type}`)
    }
  }
}