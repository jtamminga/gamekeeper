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

  // render
  return (
    <>
      <h1>Playthrough recorded</h1>

      <p>🎉 winner is <PlayerColor playerId={winnerId}>{winner}</PlayerColor></p>

      <GameSummary view={view} />
    </>
  )
}