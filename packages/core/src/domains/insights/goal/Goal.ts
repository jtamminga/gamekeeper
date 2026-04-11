import { Entity } from '@domains'
import { getDayOfYear } from 'date-fns'
import { InsightsDeps } from '../Insights'
import type { GoalData, GoalId, GoalType, UpdatedGoalData } from '@services'


/**
 * Abstract base for a yearly goal set by the user.
 * A goal has a target `value` and tracks `progress` toward it,
 * calculated against the stats service. Also computes how far along
 * the year has progressed so progress can be compared to expectations.
 *
 * Goals require an explicit `load()` call to populate `progress`
 * before accessing it, since the calculation is async.
 */
export abstract class Goal extends Entity<GoalId> {

  private _value: number
  private _progress?: number
  private _year: number

  // progress
  public constructor(protected _deps: InsightsDeps, data: GoalData) {
    super(data.id)
    this._value = data.value
    this._year = data.year
  }

  public abstract get type(): GoalType

  public get value(): number {
    return this._value
  }

  public get year(): number {
    return this._year
  }

  public get progress(): number {
    if (this._progress === undefined) {
      throw new Error('goal not loaded')
    }

    return this._progress
  }

  public get percentageDone(): number {
    return this.progress / this.value
  }

  public get expectedProgressPercentage(): number {
    return getDayOfYear(new Date()) / 365
  }

  public get expectedProgress(): number {
    return this.value * this.expectedProgressPercentage
  }

  public async load(): Promise<void> {
    this._progress = await this.determineProgress()
  }

  public update(data: Omit<UpdatedGoalData, 'id'>): void {
    this._value = data.value ?? this._value
    this._year = data.year ?? this._year
  }

  protected getBaseData(): Omit<GoalData, 'type'> {
    return {
      id: this.id,
      value: this._value,
      year: this._year,
    }
  }

  protected abstract determineProgress(): Promise<number>

  public abstract toData(): GoalData

}