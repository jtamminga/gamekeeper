import { GameSummary } from '@app/components'
import { useView } from '@app/hooks'
import { Action, Playthrough, PlaythroughView } from '@gamekeeper/core'


type Props = {
  playthrough: Playthrough
  onReset: Action
}


/**
 * Shows the playthrough added successfully
 */
export function PlaythroughAdded({ playthrough, onReset }: Props) {

  // hooks
  const { view, hydratedView } = useView((gamekeeper) => new PlaythroughView(gamekeeper, playthrough), [playthrough])

  // render
  return (
    <>
      <h1>Playthrough recorded</h1>

      <p>🎉 winner is <span className="highlight">{view.winner}</span></p>

      <button
        onClick={onReset}
      >
        Record another
      </button>

      {hydratedView &&
        <GameSummary
          view={hydratedView}
        />
      }
    </>
  )
}