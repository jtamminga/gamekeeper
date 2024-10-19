import { useGamekeeper } from '@app/hooks'
import type { PlaythroughId } from '@gamekeeper/core'


type Props = {
  playthroughId: PlaythroughId
}


export function PlaythroughDetails({ playthroughId }: Props) {

  const { gameplay } = useGamekeeper()

  return (
    <>
      <h1>Playthrough</h1>

      <div>
        <button onClick={() => gameplay.playthroughs.remove(playthroughId)}>
          Delete
        </button>
      </div>
    </>
  )
}