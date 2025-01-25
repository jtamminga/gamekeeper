export interface FormattedGoal {
  readonly name: string
  readonly description: string
  readonly value: number
  readonly active: boolean
  readonly state: 'in-progress' | 'completed' | 'failed'
  readonly progress: number
  readonly percentageDone: number
  readonly expectedProgressPercentage: number
}