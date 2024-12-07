import { playerColorClass } from '@app/helpers'
import type { PlayerId } from '@gamekeeper/core'


type Props = {
  name: string
  thisYear: string
  allTime: string
  playerId?: PlayerId
}


export function DetailedStatCard({
  name,
  playerId,
  thisYear,
  allTime
}: Props) {
  return (
    <div className={'detailed-stat-card ' + (playerId ? playerColorClass(playerId) : '')}>
      <div>{name}</div>
      <div>
        <span>2024</span>
        <span>{thisYear}</span>
      </div>
      <div>
        <span>All</span>
        <span>{allTime}</span>
      </div>
    </div>
  )
}