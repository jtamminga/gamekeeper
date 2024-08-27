import type { GameId } from '@services'
import { Goal } from './Goal'


export class PlaythroughsGoal extends Goal {

  protected async determineProgress(): Promise<number> {
    const result = await this._deps.services.statsService.getNumPlays({ year: this.year })

    let sum = 0
    for (const gameId in result) {
      sum += result[gameId as GameId]
    }

    return sum
  }

}