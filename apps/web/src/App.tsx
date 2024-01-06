import { gamekeeper } from './bootstrap'
import { Layout } from './Layout'
import { Loading } from './components'
import { useEffect, useState } from 'react'
import type { Page } from './routing'


// base app
export default function App() {
  
  // keep track of whether the app is hydrated
  const [hydrated, setHydrated] = useState(false)
  const [page, setPage] = useState<Page>('Stats')

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
    <div className="App">
      {hydrated
        ? <Layout page={page} navTo={setPage} />
        : <Loading />
      }
    </div>
  )
}