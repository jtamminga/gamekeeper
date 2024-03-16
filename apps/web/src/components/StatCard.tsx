type Props = {
  value: string | number
  description: string
}


export function StatCard({
  value,
  description
}: Props) {
  return (
    <div className="stat-card">
      <div>{value}</div>
      <div>{description}</div>
    </div>
  )
}