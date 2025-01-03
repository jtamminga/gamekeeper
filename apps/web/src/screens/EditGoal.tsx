import { GoalForm } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'
import type { GoalId } from '@gamekeeper/core'


type Props = {
  goalId: GoalId
}


export function EditGoal({ goalId }: Props) {
  const { insights } = useGamekeeper()
  const router = useRouter()
  const goal = insights.goals.get(goalId)

  return (
    <>
      <h1>{goal.name}</h1>

      <GoalForm
        submitText="Update"
        goal={goal.toData()}
        onComplete={async data => {
          await goal.update(data)
          router.setPage({ name: 'Goals'})
        }}
        disableType
      />
    </>
  )
}