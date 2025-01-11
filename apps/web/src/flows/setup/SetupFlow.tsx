import { useRouter } from '@app/hooks'
import { PlayerSetup } from './PlayerSetup'
import { GameSetup } from './GameSetup'


export function SetupFlow() {
  const { completed } = useRouter()

  return (
    <>
      <PlayerSetup />
      <GameSetup />
      <button onClick={() => completed()}>Next</button>
    </>
  )
}