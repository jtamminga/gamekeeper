import { Goal } from './Goal'
import { GoalType, type GameId, type GoalData } from '@services'


/**
 * A goal to play a target number of game sessions within a year.
 * Progress is the total play count for the year across all games.
 * Exposes `currentlyAheadBy` to show whether the user is ahead or
 * behind the expected pace for the current day of the year.
 */
export class NumberOfPlaysGoal extends Goal {

  public get type(): GoalType {
    return GoalType.NumberOfPlays
  }

  /**
   * Positive number represents ahead of the current target.
   * Negative number represents behind the current target.
   */
  public get currentlyAheadBy(): number {
    return this.progress - this.expectedProgress
  }

  public toData(): GoalData {
    return {
      ...this.getBaseData(),
      type: GoalType.NumberOfPlays
    }
  }

  protected async determineProgress(): Promise<number> {
    const result = await this._deps.service.getNumPlays({ year: this.year })

    let sum = 0
    for (const gameId in result) {
      sum += result[gameId as GameId]
    }

    return sum
  }

}