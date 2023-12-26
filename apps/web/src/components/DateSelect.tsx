
type Props = {
  date: Date
  onChange: (date: Date) => void
}


export function DateSelect({ date, onChange }: Props) {

  const formattedDate = date.toISOString().split('T')[0]

  return (
    <input
      type="date"
      value={formattedDate}
      onChange={e => {
        if (e.target.valueAsDate) {
          console.log('onChange', e.target.valueAsDate)
          onChange(e.target.valueAsDate)
        }
      }}
    />
  )

}