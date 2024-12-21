import { FormattedGoal } from '@def/models'
import { Goal } from '@gamekeeper/core'

export function formatGoal(goal: Goal): FormattedGoal {
  return {
    name: goal.name,
    value: goal.value,
    state: goal.progress >= goal.value ? 'completed' : 'active',
    progress: goal.progress,
    percentageDone: goal.percentageDone,
    expectedProgressPercentage: goal.expectedProgressPercentage
  }
}