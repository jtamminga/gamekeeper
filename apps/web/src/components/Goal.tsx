import type { Goal as GoalDomain } from '@gamekeeper/core'
import { useEffect, useState } from 'react'


type Props = {
  goal: GoalDomain
}


export function Goal({ goal }: Props) {

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      await goal.load()
      setLoaded(true)
    }

    load()
  }, [goal])

  const content = loaded
    ? renderLoaded(goal)
    : renderLoading(goal)

  return (
    <div className="goal-card">
      {content}
    </div>
  )
}

function renderLoaded(goal: GoalDomain) {
  const progress = (goal.percentageDone * 100).toString() + '%'
  const expected = (goal.expectedProgressPercentage * 100) + '%'

  return (
    <>
      <div className="goal-title">
        <span>{goal.name}</span>
        <div>{goal.progress} / {goal.value}</div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="inner-bar" style={{ width: progress }}></div>
        </div>
        <div className="expected" style={{ left: expected }}></div>
      </div>
    </>
  )
}

function renderLoading(goal: GoalDomain) {
  return (
    <>
      <div className="goal-title">
        <span>{goal.name}</span>
        <div>{goal.value}</div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>
    </>
  )
}