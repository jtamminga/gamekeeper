import { useGamekeeper } from '@app/hooks'
import type { PlaythroughId } from '@gamekeeper/core'


type Props = {
  playthroughId: PlaythroughId
}


export function PlaythroughDetails({ playthroughId }: Props) {

  const { gameplay } = useGamekeeper()

  async function onDelete() {
    if (confirm('Are you sure you want to delete?')) {
      await gameplay.playthroughs.remove(playthroughId)
      history.back()
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