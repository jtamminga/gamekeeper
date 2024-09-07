import { Entity } from '@domains'
import { getDayOfYear } from 'date-fns'
import type { GoalId } from '@services'
import type { InsightsDeps } from '../Insights'


export interface GoalData {
  id: GoalId
  name: string
  goal: number
  type: 'num_plays'
  year: number
}


export abstract class Goal extends Entity<GoalId> {

  private _name: string
  private _value: number
  private _progress?: number
  private _year: number

  // progress
  public constructor(protected _deps: InsightsDeps, data: GoalData) {
    super(data.id)
    this._name = data.name
    this._value = data.goal
    this._year = data.year
  }

  public get name(): string {
    return this._name
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

  protected abstract determineProgress(): Promise<number>

}