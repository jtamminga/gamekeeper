import { GoalType } from '@gamekeeper/core'

export interface FormattedGoal {
  readonly id: string
  readonly name: string
  readonly type: GoalType
  readonly description: string
  readonly value: number
  readonly active: boolean
  readonly state: 'in-progress' | 'completed' | 'failed'
  readonly progress: number
  readonly percentageDone: number
  readonly expectedProgressPercentage: number
  readonly percentageDoneFormatted: string
  readonly expectedProgressPercentageFormatted: string
}

export interface NumberOfPlaysFormattedGoal extends FormattedGoal {
  readonly type: GoalType.NumberOfPlays
  readonly currentlyAheadBy: number
}

export namespace NumberOfPlaysFormattedGoal {
  export function guard(formatted: FormattedGoal | NumberOfPlaysFormattedGoal): formatted is NumberOfPlaysFormattedGoal {
    return formatted.type === GoalType.NumberOfPlays
  }
}