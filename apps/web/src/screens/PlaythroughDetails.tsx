import { useGamekeeper } from '@app/hooks'
import type { PlaythroughId } from '@gamekeeper/core'


type Props = {
  playthroughId: PlaythroughId
}


export function PlaythroughDetails({ playthroughId }: Props) {

  const { gameplay } = useGamekeeper()

  function onDelete() {
    if (confirm('Are you sure you want to delete?')) {
      gameplay.playthroughs.remove(playthroughId)
    }
  }

  return (
    <>
      <h1>Playthrough</h1>

      <div>
        <button onClick={onDelete}>
          Delete
        </button>
      </div>
    </>
  )
}