import { PlaythroughFlow } from '@app/flows'
import { useGamekeeper } from '@app/hooks'
import { CoopFlow, Playthrough, VsFlow } from '@gamekeeper/core'
import { useState } from 'react'


//
export function AddPlaythrough() {

  const gamekeeper = useGamekeeper()
  const [loading, setLoading] = useState(false)
  const [playthrough, setPlaythrough] = useState<Playthrough>()

  async function onComplete(flow: VsFlow | CoopFlow) {
    setLoading(true)

    const playthroughData = flow.build()
    const playthrough = await gamekeeper.playthroughs.create(playthroughData)

    setPlaythrough(playthrough)
    setLoading(false)
  }

  function onRecordAnother() {
    setPlaythrough(undefined)
  }

  // show loader if loading
  if (loading) {
    return (
      <div>loading...</div>
    )
  }

  // if playthrough show complete screen
  if (playthrough) {
    return (
      <div>

        <p>{playthrough.winnerName} won!</p>

        <p>playthrough recorded</p>

        <button
          onClick={onRecordAnother}
        >
          Record another
        </button>

      </div>
    )
  }

  // else render flow
  return (
    <PlaythroughFlow
      onComplete={onComplete}
    />
  )
}