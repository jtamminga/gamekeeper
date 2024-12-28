import { PlayerForm } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'


export function AddPlayer() {
  const { gameplay } = useGamekeeper()
  const router = useRouter()

  return (
    <>
      <h1>Add player</h1>

      <PlayerForm
        submitText="Create"
        onComplete={async data => {
          await gameplay.players.create(data)
          router.setPage({ name: 'Players'})
        }}
      />
    </>
  )
}