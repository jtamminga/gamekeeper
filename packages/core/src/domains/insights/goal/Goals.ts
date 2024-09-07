import { PlaythroughsGoal } from './PlaythroughsGoal'
import type { Goal } from './Goal'
import type { GoalId } from '@services'
import type { InsightsDeps } from '../Insights'


export class Goals {

  private _goals: Goal[]

  public constructor(
    private _deps: InsightsDeps
  ) {
    this._goals = []
  }

  public async hydrate(): Promise<Goals> {
    this._goals = [
      new PlaythroughsGoal(this._deps, {
        id: '1' as GoalId,
        type: 'num_plays',
        name: 'Games played',
        goal: 120,
        year: 2024
      })
    ]

    return this
  }

  public all(): ReadonlyArray<Goal> {
    return this._goals
  }

  public get topPriority(): Goal {
    return this._goals[0]
  }
}