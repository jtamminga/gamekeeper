import { GoalData, GoalType } from '@services'
import { Goal } from './Goal'


/**
 * A goal to play a target number of distinct games within a year.
 * Progress is the count of unique game titles played at least once.
 */
export class UniqueGamesPlayedGoal extends Goal {

  public get type(): GoalType {
    return GoalType.UniqueGamesPlayed
  }

  protected async determineProgress(): Promise<number> {
    return this._deps.service.getNumUniqueGamesPlayed(this.year)
  }

  public toData(): GoalData {
    return {
      ...this.getBaseData(),
      type: GoalType.UniqueGamesPlayed
    }
  }
  
}