import { useAuth, authEnabled } from './bootstrap'
import { Loading } from './components'
import { Layout } from './Layout'
import { Landing } from './screens'


export function Flow() {

  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated && authEnabled) {
    return <Landing />
  }

  return <Layout />
}