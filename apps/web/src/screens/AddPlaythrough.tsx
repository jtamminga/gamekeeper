import { PlaythroughSummary } from '@app/components'
import { PlaythroughFlow } from '@app/flows'
import { useGamekeeper } from '@app/hooks'
import { CoopFlow, HydratedPlaythroughView, PlaythroughView, VsFlow } from '@gamekeeper/core'
import { useState } from 'react'


// screen
export function AddPlaythrough() {

  const gamekeeper = useGamekeeper()
  const [completed, setCompleted] = useState(false)
  const [summaryView, setSummaryView] = useState<HydratedPlaythroughView>()

  async function onComplete(flow: VsFlow | CoopFlow) {
    setCompleted(true)

    const playthroughData = flow.build()
    const playthrough = await gamekeeper.playthroughs.create(playthroughData)
    const view = await new PlaythroughView(playthrough).hydrate(gamekeeper)

    setSummaryView(view)
  }

  function onRecordAnother() {
    setSummaryView(undefined)
    setCompleted(false)
  }

  // if flow not completed then render flow
  if (!completed) {
    return (
      <PlaythroughFlow
        onComplete={onComplete}
      />
    )
  }

  // otherwise show summary screen
  else {
    return (
      <>
        <h1>Playthrough recorded</h1>

        {summaryView &&
          <p>🎉 winner is <span className="highlight">{summaryView.winner}</span></p>
        }

        <button
          onClick={onRecordAnother}
        >
          Record another
        </button>

        {summaryView &&
          <PlaythroughSummary
            view={summaryView}
          />
        }
      </>
    )
  }
}