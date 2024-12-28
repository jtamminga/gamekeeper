import { PlayerForm } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'
import { PlayerId } from '@gamekeeper/core'


type Props = {
  playerId: PlayerId
}


export function EditPlayer({ playerId }: Props) {
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
          router.setPage({ name: 'Players'})
        }}
      />
    </>
  )
}