import { Entity } from '@domains'
import { getDayOfYear } from 'date-fns'
import type { GoalData, GoalId, UpdatedGoalData } from '@services'
import { InsightsDeps } from '../Insights'


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

  public async update(data: Omit<UpdatedGoalData, 'id'>): Promise<void> {
    this._value = data.value ?? this._value
    this._year = data.year ?? this._year
    await this._deps.repo.updateGoal(this)
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