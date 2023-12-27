import { PlaythroughFlow } from '@app/flows'
import { useGamekeeper } from '@app/hooks'
import { CoopFlow, VsFlow } from '@gamekeeper/core'


//
export function AddPlaythrough() {

  const gamekeeper = useGamekeeper()

  async function onComplete(flow: VsFlow | CoopFlow) {
    const playthroughData = flow.build()
    await gamekeeper.playthroughs.create(playthroughData)
  }

  return (
    <div>
      
      <PlaythroughFlow
        onComplete={onComplete}
      />

    </div>
  )
}