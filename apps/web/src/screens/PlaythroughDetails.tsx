import { PlayerColor, StatCard } from '@app/components'
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
      <h1>{view.game}</h1>
      <h2>Playthrough</h2>

      <div>{view.playedOn}</div>

      <h3>Winner</h3>
      <div className="callout">
        The winner <PlayerColor playerId={view.winnerId}>{view.winner}</PlayerColor>
      </div>

      <h3>Scores</h3>
      <div className="mb-lg">
        {view.scores && view.scores.length > 0
          ? view.scores.map(score =>
              <StatCard
                value={score.score}
                description={<PlayerColor playerId={score.playerId}>{score.name}</PlayerColor>}
              />
            )
          : <div className="text-muted">no scores recorded</div>
        }
      </div>

      <button onClick={onDelete}>
        Delete
      </button>
    </>
  )
}