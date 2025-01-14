import { Link, Loading } from '@app/components'
import { useGamekeeper } from '@app/hooks'
import { nameForGoalType } from '@gamekeeper/views'
import { useEffect, useState } from 'react'


export function Goals() {
  const { insights } = useGamekeeper()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async function loadGoals() {
      await insights.goals.hydrate()
      setLoading(false)
    })()
  }, [insights.goals])

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className="title-with-link">
        <h1>Goals</h1>
        <Link page={{ name: 'AddGoal' }}>
          Add goal
        </Link>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th className="num">Goal</th>
            <th className="num">Year</th>
          </tr>
        </thead>
        <tbody>
          {insights.goals.all().map(goal =>
            <tr key={goal.id}>
              <td>
                <Link
                  key={goal.id}
                  page={{ name: 'EditGoal', props: { goalId: goal.id } }}
                >
                  {nameForGoalType(goal.toData().type)}
                </Link>
              </td>
              <td className="num">{goal.value}</td>
              <td className="num">{goal.year}</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}