import { FormattedGoal, NumberOfPlaysFormattedGoal } from '@gamekeeper/views'


type Props = {
  goal: FormattedGoal
}


export function Goal({ goal }: Props) {
  if (NumberOfPlaysFormattedGoal.guard(goal)) {
    return renderNumPlaysGoal(goal)
  }
  else {
    return renderGenericGoal(goal)
  }
}


function renderGenericGoal(goal: FormattedGoal) {
  const {
    state,
    value,
    name,
    progress,
    percentageDoneFormatted
  } = goal

  return (
    <div className={'goal-card ' + state}>
      <div className="goal-title">
        <span>{name}</span>
        <div>{progress} / {value}</div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="inner-bar" style={{ width: percentageDoneFormatted }}></div>
        </div>
      </div>
    </div>
  )
}

function renderNumPlaysGoal(goal: NumberOfPlaysFormattedGoal) {
  const {
    state,
    value,
    name,
    progress,
    percentageDoneFormatted,
    expectedProgressPercentageFormatted,
    currentlyAheadBy
  } = goal

  const currentlyAheadByVerbage = currentlyAheadBy === 0
    ? 'on target'
    : currentlyAheadBy > 0
      ? `${currentlyAheadBy} ahead`
      : `${Math.abs(currentlyAheadBy)} behind`

  return (
    <div className={'goal-card ' + state}>
      <div className="goal-title">
        <span>{name}</span>
        <div className="goal-stats">
          <div
            className={currentlyAheadBy >= 0 ? 'ahead' : 'behind'}
          >{currentlyAheadByVerbage}</div>
          <div>{progress} / {value}</div>
        </div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div className="inner-bar" style={{ width: percentageDoneFormatted }}></div>
        </div>
        { goal.active &&
          <div className="expected" style={{ left: expectedProgressPercentageFormatted }}></div>
        }
      </div>
    </div>
  )
}