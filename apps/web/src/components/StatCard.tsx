import type { Action } from '@gamekeeper/core'


type Props = {
  value: string | number
  description: JSX.Element | string
  onClick?: Action
}


export function StatCard({
  value,
  description,
  onClick
}: Props) {
  return (
    <div className="stat-card" onClick={onClick}>
      <div>{value}</div>
      <div>{description}</div>
    </div>
  )
}