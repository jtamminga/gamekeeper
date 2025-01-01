import { Link } from '@app/components'
import { useGamekeeper } from '@app/hooks'


export function Goals() {
  const { insights } = useGamekeeper()

  return (
    <>
      <div className="title-with-link">
        <h1>Goals</h1>
        <Link page={{ name: 'AddGoal' }}>
          Add goal
        </Link>
      </div>
      
      <div className="link-list">
        {insights.goals.all().map(goal =>
          <Link
            key={goal.id}
            page={{ name: 'EditGoal', props: { goalId: goal.id } }}
          >
            {goal.name}
          </Link>
        )}
      </div>
    </>
  )
}