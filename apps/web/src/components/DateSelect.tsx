import { format, parse } from 'date-fns'


type Props = {
  date: Date
  onChange: (date: Date) => void
}


const DATE_FORMAT = 'yyyy-MM-dd'


export function DateSelect({ date, onChange }: Props) {

  const formattedDate = format(date, DATE_FORMAT)

  return (
    <div className="form-control">
      <label>Played on</label>
      <input
        type="date"
        value={formattedDate}
        onChange={e => {
          if (e.target.value) {
            const date = parse(e.target.value, DATE_FORMAT, new Date())
            onChange(date)
          }
        }}
      />
    </div>
  )

}