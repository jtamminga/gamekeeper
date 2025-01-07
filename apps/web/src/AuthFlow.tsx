import { useAuth } from './bootstrap'
import { Loading } from './components'
import { GamekeeperProvider } from './Gamekeeper'
import { Landing } from './screens'
import { OnLoginFlow } from './UserStateFlow'


export function AuthFlow() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Landing />
  }

  return (
    <GamekeeperProvider>
      <OnLoginFlow />
    </GamekeeperProvider>
  )
}