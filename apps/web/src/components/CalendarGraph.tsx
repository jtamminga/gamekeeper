// import { addDays } from 'date-fns'

type Props = {
  countPerDay: number[]
  firstDay: Date
}


const daysInWeek = 7


export function CalendarGraph({ countPerDay }: Props) {
  const numColumns = Math.ceil(countPerDay.length / daysInWeek)

  const rows: JSX.Element[] = []
  let row: JSX.Element[] = []

  for (let y = 0; y < daysInWeek; y++) {
    for (let i = 0; i < numColumns; i++) {
      const index = (i * daysInWeek) + y
      const count = countPerDay[index]

      row.push(
        <td
          className={classByCount(count)}
        ></td>
      )
    }

    rows.push(
      <tr>
        {row}
      </tr>
    )

    row = []
  }

  return (
    <table className="calendar-graph">
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

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