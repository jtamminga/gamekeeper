import { Loading, PlaythroughForm } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'
import { CallbackPageProps } from '@app/routing'
import type { Playthrough, PlaythroughId } from '@gamekeeper/core'
import { useEffect, useState } from 'react'


type Props = {
  playthroughId: PlaythroughId
} & CallbackPageProps


export function EditPlaythrough({ playthroughId, callback }: Props) {
  const { gameplay } = useGamekeeper()
  const router = useRouter()
  const [playthrough, setPlaythrough] = useState<Playthrough>()

  useEffect(() => {
    gameplay.playthroughs.fetch(playthroughId).then(setPlaythrough)
  }, [gameplay, playthroughId])

  if (!playthrough) {
    return <Loading />
  }

  async function onDelete() {
    if (confirm('Are you sure you want to delete?')) {
      await gameplay.playthroughs.remove(playthroughId)
      router.setPage({ name: 'Playthroughs', props: {} })
    }
  }

  return (
    <>
      <h1>{playthrough.game.name}</h1>

      <PlaythroughForm
        submitText="Update"
        playthrough={playthrough}
        onComplete={async data => {
          playthrough.update(data)
          await gameplay.playthroughs.save(playthrough)
          router.setPage(callback ?? { name: 'PlaythroughDetails', props: { playthroughId } })
        }}
      />

      <div className="danger-zone">
        <h3>Danger zone</h3>
        <button onClick={onDelete}>
          Delete
        </button>
      </div>
    </>
  )
}
