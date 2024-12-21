import type { FormattedGoal } from '@gamekeeper/views'


type Props = {
  goal: FormattedGoal
}


export function Goal({ goal }: Props) {

  const progress = (goal.percentageDone * 100).toString() + '%'
  const expected = (goal.expectedProgressPercentage * 100) + '%'

  return (
    <div className="goal-card">
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
    </div>
  )
}