import { ReactNode, useEffect, useState } from 'react'
import { initialize, useAuth } from '@app/bootstrap'
import { Loading } from '@app/components'


type Props = {
  children: ReactNode
}


export function GamekeeperProvider({ children }: Props) {
  const { getAccessTokenSilently } = useAuth()
  const [hydrated, setHydrated] = useState(false)

  // hydrate the app
  useEffect(() => {
    async function hydrateApp() {
      const token = await getAccessTokenSilently()
      await initialize(token)
      setHydrated(true)
    }

    hydrateApp()
  }, [getAccessTokenSilently])

  if (!hydrated) {
    return <Loading />
  }

  return children
}