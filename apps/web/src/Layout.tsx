import { router } from './routing'
import { Header } from './Header'
import { useRouter } from './hooks'
import { useEffect, useState } from 'react'
import { initialize, useAuth } from './bootstrap'
import { Loading } from './components'


export function Layout() {
  const { page } = useRouter()
  const [hydrated, setHydrated] = useState(false)
  const { getAccessTokenSilently } = useAuth()

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

  return (
    <>
      <Header />

      <main>
        {router(page)}
      </main>
    </>
  )
}