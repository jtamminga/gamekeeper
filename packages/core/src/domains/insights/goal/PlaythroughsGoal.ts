import { Goal } from './Goal'
import type { GameId } from '@services'


export class PlaythroughsGoal extends Goal {

  protected async determineProgress(): Promise<number> {
    const result = await this._deps.service.getNumPlays({ year: this.year })

    let sum = 0
    for (const gameId in result) {
      sum += result[gameId as GameId]
    }

    return sum
  }

}