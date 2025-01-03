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

  async function onDelete() {
    if (confirm('Are you sure you want to delete?')) {
      await insights.goals.remove(goalId)
      history.back()
    }
  }

  return (
    <>
      <div className="title-with-link">
        <h1>{goal.name}</h1>
        <a onClick={onDelete} className="danger">
          delete
        </a>
      </div>

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