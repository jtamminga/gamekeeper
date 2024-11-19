import { formatDate } from '@gamekeeper/core'
import { addDays, format } from 'date-fns'


// types
type Props = {
  countPerDay: number[]
  firstDay: Date
}


// consts
const daysInWeek = 7


// component
export function CalendarGraph({ countPerDay, firstDay }: Props) {
  const numColumns = Math.ceil(countPerDay.length / daysInWeek)

  const rows: JSX.Element[] = []
  let row: JSX.Element[] = []

  // dec is a hack to prevent dec showing first in some cases
  let preMonthLabel = 'Dec'
  // row with month labels
  for (let i = 0; i < numColumns; i++) {
    const index = i * daysInWeek
    const date = addDays(firstDay, index)
    const monthLabel = format(date, 'MMM')
    const displayLabel = monthLabel !== preMonthLabel
      ? monthLabel
      : ''
    preMonthLabel = monthLabel
    row.push(<td key={`month-${i}`}>{displayLabel}</td>)
  }
  rows.push(<tr key="months">{row}</tr>)
  

  // days representing play frequency
  for (let y = 0; y < daysInWeek; y++) {
    row = []
    for (let i = 0; i < numColumns; i++) {
      const index = (i * daysInWeek) + y
      const count = countPerDay[index]
      const date = addDays(firstDay, index)

      row.push(
        <td
          key={`day-${index}`}
          className={classByCount(count)}
          title={formatDate(date, true) + ` - plays: ${count}`}
        ></td>
      )
    }

    rows.push(
      <tr key={`row-${y}`}>
        {row}
      </tr>
    )
  }

  return (
    <div className="calendar-graph-container">
      <table className="calendar-graph">
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}


// helpers
function classByCount(plays: number | undefined): string {
  if (plays === undefined) {
    return 'day-undefined'
  }
  else if (plays === 0) {
    return 'day-none'
  }
  else if (plays === 1) {
    return 'day-one'
  }
  else {
    return 'day-many'
  }
}