import { GoalData, GoalType } from '@services'
import { Goal } from './Goal'


export class UniqueGamesPlayedGoal extends Goal {

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