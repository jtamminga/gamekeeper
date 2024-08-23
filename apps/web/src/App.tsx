import { gamekeeper } from './bootstrap'
import { Layout } from './Layout'
import { Loading } from './components'
import { useEffect, useState } from 'react'
import { RouterContainer } from './Router'


// base app
export default function App() {
  
  // keep track of whether the app is hydrated
  const [hydrated, setHydrated] = useState(false)

  // hydrate the app
  useEffect(() => {
    async function hydrateApp() {
      await gamekeeper.hydrate({ limit: 10 })
      setHydrated(true)
    }

    hydrateApp()
  }, [])

  // render
  return (
    <>
      <RouterContainer>
        {hydrated
          ? <Layout />
          : <Loading />
        }
      </RouterContainer>
    </>
  )
}