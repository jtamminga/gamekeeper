import { GameSummary, Loading, PlayerColor } from '@app/components'
import { useGameView } from '@app/hooks'
import { Action, Playthrough } from '@gamekeeper/core'
import { formatPlaythrough } from '@gamekeeper/views'


type Props = {
  playthrough: Playthrough
  onReset: Action
}


/**
 * Shows the playthrough added successfully
 */
export function PlaythroughAdded({ playthrough, onReset }: Props) {

  const view = useGameView(playthrough.gameId)
  if (!view) {
    return <Loading />
  }

  const { winnerId, winner } = formatPlaythrough(playthrough)

  // render
  return (
    <>
      <h1>Playthrough recorded</h1>

      <p>🎉 winner is <PlayerColor playerId={winnerId}>{winner}</PlayerColor></p>

      <button onClick={onReset}>
        Record another
      </button>

      <GameSummary view={view} />
    </>
  )
}