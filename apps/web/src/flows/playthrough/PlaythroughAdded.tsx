import { GameSummary, Loading, PlayerColor } from '@app/components'
import { useGameView } from '@app/hooks'
import { Playthrough } from '@gamekeeper/core'
import { formatPlaythrough } from '@gamekeeper/views'


type Props = {
  playthrough: Playthrough
}


/**
 * Shows the playthrough added successfully
 */
export function PlaythroughAdded({ playthrough }: Props) {

  const view = useGameView(playthrough.gameId)
  if (!view) {
    return <Loading />
  }

  const { winnerId, winner } = formatPlaythrough(playthrough)
  const isNewHighScore = view.scoreStats?.best.playthroughId === playthrough.id

  // render
  return (
    <>
      <h1>Playthrough recorded</h1>

      {/* winner */}
      <div className="callout callout-success">
        🎉 winner is <PlayerColor playerId={winnerId}>{winner}</PlayerColor>
      </div>

      {/* new high score */}
      {isNewHighScore && (
        <div className="callout callout-success">
          🏆 New high score!
        </div>
      )}

      <GameSummary view={view} />
    </>
  )
}