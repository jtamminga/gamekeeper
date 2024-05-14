import { useGamekeeper } from '@app/hooks'
import type { PlaythroughId } from '@gamekeeper/core'


type Props = {
  playthroughId: PlaythroughId
}


export function PlaythroughDetails({ playthroughId }: Props) {

  const gamekeeper = useGamekeeper()

  return (
    <>
      <h1>Playthrough</h1>

      <div>
        <button onClick={() => gamekeeper.playthroughs.remove(playthroughId)}>
          Delete
        </button>
      </div>
    </>
  )
}