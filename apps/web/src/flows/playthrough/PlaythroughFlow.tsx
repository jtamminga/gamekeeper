import { ReactNode, useState } from 'react'
import { CoopFlow, Playthrough, PlaythroughFlow as PlaythroughFlowModel, VsFlow } from '@gamekeeper/core'
import { VsFlowPartial } from './VsFlow'
import { BaseFlow } from './BaseFlow'
import { CoopFlowPartial } from './CoopFlow'
import { PlaythroughAdded } from './PlaythroughAdded'
import { Loading } from '@app/components'
import { formatDate } from '@gamekeeper/views'
import { useRouter } from '@app/hooks'


/**
 * Flow for adding a new playthrough
 */
export function PlaythroughFlow() {

  const { page, setPage } = useRouter()
  const [flow, setFlow] = useState<PlaythroughFlowModel>()
  const [completed, setCompleted] = useState(false)
  const [playthrough, setPlaythrough] = useState<Playthrough>()

  async function onComplete(flow: PlaythroughFlowModel) {
    setCompleted(true)

    const playthrough = await flow.build()
    setPlaythrough(playthrough)

    // set the completed game onto the page props so that clicking
    // "Record" again pre-selects the same game
    const resetKey = page.name === 'AddPlaythrough' ? page.props?.resetKey : undefined
    setPage({ name: 'AddPlaythrough', props: { gameId: flow.game.id, resetKey } })
  }

  let contents: ReactNode = null

  // if completed show result screen
  // we return in this case so we don't render the layout below
  if (completed) {
    // while waiting for the playthrough show loader
    return playthrough
      ? <PlaythroughAdded playthrough={playthrough} />
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