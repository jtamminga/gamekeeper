import { PlayerForm } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'
import { CallbackPageProps } from '@app/routing'
import type { PlayerId } from '@gamekeeper/core'


type Props = {
  playerId: PlayerId
} & CallbackPageProps


export function EditPlayer({ playerId, callback = { name: 'Players' } }: Props) {
  const { gameplay } = useGamekeeper()
  const router = useRouter()
  const player = gameplay.players.get(playerId)

  return (
    <>
      <h1>{player.name}</h1>

      <PlayerForm
        submitText="Update"
        player={player}
        onComplete={async data => {
          await player.update(data)
          router.setPage(callback)
        }}
      />
    </>
  )
}