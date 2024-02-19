import { ReactNode, useState } from 'react'
import { CoopFlow, Playthrough, PlaythroughFlow as PlaythroughFlowModel, VsFlow, formatDate } from '@gamekeeper/core'
import { VsFlowPartial } from './VsFlow'
import { BaseFlow } from './BaseFlow'
import { CoopFlowPartial } from './CoopFlow'
import { useGamekeeper } from '@app/hooks'
import { PlaythroughAdded } from './PlaythroughAdded'
import { Loading } from '@app/components'


/**
 * Flow for adding a new playthrough
 */
export function PlaythroughFlow() {

  const gamekeeper = useGamekeeper()
  const [flow, setFlow] = useState<PlaythroughFlowModel>()
  const [completed, setCompleted] = useState(false)
  const [playthrough, setPlaythrough] = useState<Playthrough>()


  async function onComplete(flow: PlaythroughFlowModel) {
    setCompleted(true)

    const playthroughData = flow.build()
    const playthrough = await gamekeeper.playthroughs.create(playthroughData)
    setPlaythrough(playthrough)
  }

  function onReset() {
    setFlow(undefined)
    setCompleted(false)
    setPlaythrough(undefined)
  }

  let contents: ReactNode = null

  // when completed show result screen
  // we return in this case so we don't render the layout below
  if (completed) {
    return playthrough
      ? <PlaythroughAdded
          playthrough={playthrough}
          onReset={onReset}
        />
      : <Loading />
  }
 
  else if (flow === undefined) {
    contents = (
      <BaseFlow
        onComplete={flow => setFlow(flow)}
      />
    )
  }

  else if (flow instanceof VsFlow) {
    contents = (
      <VsFlowPartial
        flow={flow}
        onComplete={() => onComplete(flow)}
      />
    )
  }

  else if (flow instanceof CoopFlow) {
    contents = (
      <CoopFlowPartial
        flow={flow}
        onComplete={() => onComplete(flow)}
      />
    )
  }

  // render title with contents
  return (
    <>
      <h1>Record</h1>
      {flow &&
        <h3>for {flow.game.name} on {formatDate(flow.playedOn)}</h3>
      }
      
      {contents}
    </>
  )
}