
type Props = {
  date: Date
  onChange: (date: Date) => void
}


export function DateSelect({ date, onChange }: Props) {

  const formattedDate = date.toISOString().split('T')[0]

  return (
    <div className="form-control">
      <label>Played on</label>
      <input
        type="date"
        value={formattedDate}
        onChange={e => {
          if (e.target.valueAsDate) {
            onChange(e.target.valueAsDate)
          }
        }}
      />
    </div>
  )

}