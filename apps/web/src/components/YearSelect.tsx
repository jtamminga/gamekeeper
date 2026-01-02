import { Callback } from '@gamekeeper/core'


type Props = {
  currentYear: number
  viewingYear: number
  setViewingYear: Callback<number>
}


export function YearSelect({ currentYear, viewingYear, setViewingYear }: Props) {
  return (
    <div className="text-muted mt-lg">
      go to <a role="button" onClick={() => setViewingYear(viewingYear - 1)}>{viewingYear - 1}</a>
      {viewingYear < currentYear &&
        <> or <a role="button" onClick={() => setViewingYear(viewingYear + 1)}>{viewingYear + 1}</a></>
      }
    </div>
  )
}