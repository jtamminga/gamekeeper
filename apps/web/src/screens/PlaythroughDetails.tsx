import { PlayerColor } from '@app/components'
import { useGamekeeper, usePlaythroughView } from '@app/hooks'
import type { PlaythroughId } from '@gamekeeper/core'


type Props = {
  playthroughId: PlaythroughId
}


export function PlaythroughDetails({ playthroughId }: Props) {

  const { gameplay } = useGamekeeper()
  const view = usePlaythroughView(playthroughId)

  async function onDelete() {
    if (confirm('Are you sure you want to delete?')) {
      await gameplay.playthroughs.remove(playthroughId)
      history.back()
    }
  }

  return (
    <>
      <h1>Playthrough</h1>

      <div className="pill">{view.playedOn}</div>

      The winner was <PlayerColor playerId={view.winnerId}>{view.winner}</PlayerColor>

      {view.scores &&
        <ul>
          {view.scores.map(score =>
            <div>{score.name} {score.score}</div>
          )}
        </ul>
      }

      <div>
        <button onClick={onDelete}>
          Delete
        </button>
      </div>
    </>
  )
}