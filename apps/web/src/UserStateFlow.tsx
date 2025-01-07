import { useGamekeeper } from '@app/hooks'
import { Layout } from './Layout'
import { SetupFlow } from './flows'


export function OnLoginFlow() {
  
  const { gameplay } = useGamekeeper()
  const setup = gameplay.players.all().length > 0

  if (setup) {
    return <Layout />
  }
  else {
    return <SetupFlow />
  }
  
}