import { FormattedGoal } from '@def/models'
import { Goal, GoalType } from '@gamekeeper/core'

export function formatGoal(goal: Goal): FormattedGoal {
  const curYear = new Date().getFullYear()
  const goalType = goal.toData().type
  const active = goal.year === curYear

  return {
    id: goal.id,
    name: nameForGoalType(goalType),
    active,
    description: descriptionForGoalType(goalType),
    value: goal.value,
    state: goal.progress >= goal.value
      ? 'completed'
      : active
        ? 'in-progress'
        : 'failed',
    progress: goal.progress,
    percentageDone: goal.percentageDone,
    expectedProgressPercentage: goal.expectedProgressPercentage
  }
}

export function nameForGoalType(type: GoalType): string {
  switch (type) {
    case GoalType.NumberOfPlays:
      return 'Games played'
    case GoalType.UniqueGamesPlayed:
      return 'Unique games played'
    default:
      throw new Error('cannot get name of goal')
  }
}
export function descriptionForGoalType(type: GoalType): string {
  switch (type) {
    case GoalType.NumberOfPlays:
      return 'Number of games played for the year'
    case GoalType.UniqueGamesPlayed:
      return 'Unique number of games played for the year'
    default:
      throw new Error('cannot get description of goal')
  }
}