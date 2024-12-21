export interface FormattedGoal {
  readonly name: string
  readonly value: number
  readonly state: 'active' | 'completed' | 'failed'
  readonly progress: number
  readonly percentageDone: number
  readonly expectedProgressPercentage: number
}