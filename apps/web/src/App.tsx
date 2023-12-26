import './App.css'
import { AddPlaythrough } from './screens'
import { gamekeeper } from './bootstrap'
import { Loading } from './components'
import { useEffect, useState } from 'react'


// base app
export default function App() {

  // keep track of whether the app is hydrated
  const [hydrated, setHydrated] = useState(false)

  // hydrate the app
  useEffect(() => {
    async function hydrateApp() {
      await gamekeeper.hydrate()
      setHydrated(true)
    }

    hydrateApp()
  }, [])

  // render
  return (
    <div className="App">
      {hydrated
        ? <AddPlaythrough />
        : <Loading />
      }
    </div>
  )
}
