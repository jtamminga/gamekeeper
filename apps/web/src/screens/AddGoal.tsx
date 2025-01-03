import { GoalForm } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'


export function AddGoal() {
  const { insights } = useGamekeeper()
  const router = useRouter()

  return (
    <>
      <h1>Add goal</h1>

      <GoalForm
        submitText="Create"
        onComplete={async data => {
          await insights.goals.create(data)
          router.setPage({ name: 'Goals'})
        }}
      />
    </>
  )
}