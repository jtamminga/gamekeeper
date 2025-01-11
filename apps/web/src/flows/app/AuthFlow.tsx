import { useAuth } from '@app/bootstrap'
import { Loading } from '@app/components'
import { GamekeeperProvider } from '@app/providers'
import { Landing } from '@app/screens'
import { AuthenticatedAppFlow } from './AuthenticatedApp'


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
      <AuthenticatedAppFlow />
    </GamekeeperProvider>
  )
}