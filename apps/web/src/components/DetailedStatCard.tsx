import { playerColorClass } from '@app/helpers'
import { useGamekeeper } from '@app/hooks'
import type { PlayerId } from '@gamekeeper/core'


type Props = {
  name: string
  year: number
  thisYear: string
  allTime: string
  playerId?: PlayerId
}


export function DetailedStatCard({
  name,
  year,
  playerId,
  thisYear,
  allTime
}: Props) {
  const { gameplay } = useGamekeeper()
  const color = playerId
    ? gameplay.players.get(playerId).color
    : undefined

  return (
    <div className={'detailed-stat-card ' + (color ? playerColorClass(color) : '')}>
      <div>{name}</div>
      <div>
        <span>{year}</span>
        <span>{thisYear}</span>
      </div>
      <div>
        <span>All</span>
        <span>{allTime}</span>
      </div>
    </div>
  )
}