import { formatDate } from '@gamekeeper/core'
import { addDays } from 'date-fns'


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

  for (let y = 0; y < daysInWeek; y++) {
    for (let i = 0; i < numColumns; i++) {
      const index = (i * daysInWeek) + y
      const count = countPerDay[index]
      const date = addDays(firstDay, index)
      // console.log(`index: ${index}, count: ${count}`, date)

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

    row = []
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