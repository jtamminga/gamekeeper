import { Goal } from './Goal'
import { GoalType, type GameId, type GoalData } from '@services'


export class PlaythroughsGoal extends Goal {

  public get name(): string {
    return 'Games played'
  }

  public toData(): GoalData {
    return {
      ...this.getBaseData(),
      type: GoalType.NumPlays
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