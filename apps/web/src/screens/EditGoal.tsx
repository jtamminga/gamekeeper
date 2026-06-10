import { GoalForm } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'
import type { GoalId } from '@gamekeeper/core'
import { nameForGoalType } from '@gamekeeper/views'


type Props = {
  goalId: GoalId
}


export function EditGoal({ goalId }: Props) {
  const { insights } = useGamekeeper()
  const router = useRouter()
  const goal = insights.goals.get(goalId)

  async function onDelete() {
    if (confirm('Are you sure you want to delete?')) {
      await insights.goals.remove(goalId)
      router.setPage({ name: 'Goals' })
    }
  }

  return (
    <>
      <h1>{nameForGoalType(goal.type)}</h1>

      <GoalForm
        submitText="Update"
        goal={goal.toData()}
        onComplete={async data => {
          goal.update(data)
          await insights.goals.save(goal)
          router.setPage({ name: 'Goals'})
        }}
        disableType
      />

      <div className="danger-zone">
        <h3>Danger zone</h3>
        <button onClick={onDelete}>
          Delete
        </button>
      </div>
    </>
  )
}