import { PlaythroughSummary } from '@app/components'
import { useGamekeeper } from '@app/hooks'
import { Action, HydratedPlaythroughView, Playthrough, PlaythroughView } from '@gamekeeper/core'
import { useEffect, useMemo, useState } from 'react'


type Props = {
  playthrough: Playthrough
  onReset: Action
}


export function PlaythroughResult({ playthrough, onReset }: Props) {

  const gamekeeper = useGamekeeper()
  const view = useMemo(() => new PlaythroughView(playthrough), [playthrough])
  const [hydratedView, setHydratedView] = useState<HydratedPlaythroughView>()

  // load hydrated view
  useEffect(() => {
    async function loadView() {
      setHydratedView(await view.hydrate(gamekeeper))
    }
    loadView()
  }, [view, gamekeeper])

  return (
    <>
      <h1>Playthrough recorded</h1>

      {view &&
        <p>🎉 winner is <span className="highlight">{view.winner}</span></p>
      }

      <button
        onClick={onReset}
      >
        Record another
      </button>

      {hydratedView &&
        <PlaythroughSummary
          view={hydratedView}
        />
      }
    </>
  )
}