import { GoalData, GoalType } from '@services'
import { Goal } from './Goal'
import { NumberOfPlaysGoal } from './NumberOfPlaysGoal'
import { InsightsDeps } from '../Insights'
import { UniqueGamesPlayedGoal } from './UniqueGamesPlayedGoal'


export namespace GoalFactory {
  export function create(deps: InsightsDeps, data: GoalData): Goal {
    switch (data.type) {
      case GoalType.NumberOfPlays:
        return new NumberOfPlaysGoal(deps, data)
      case GoalType.UniqueGamesPlayed:
        return new UniqueGamesPlayedGoal(deps, data)
      default:
        throw new Error(`Unknown goal type: ${data.type}`)
    }
  }
}