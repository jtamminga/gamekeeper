import { RouterContainer } from './Router'
import { AuthProvider } from './bootstrap-components'
import { Flow } from './Flow'


// base app
export default function App() {
  
  // keep track of whether the app is hydrated
  // const [hydrated, setHydrated] = useState(false)

  // hydrate the app
  // useEffect(() => {
  //   async function hydrateApp() {
  //     await initialize()
  //     setHydrated(true)
  //   }

  //   hydrateApp()
  // }, [])

  // render
  return (
    <>
      <AuthProvider>
        <RouterContainer>
          <Flow />
        </RouterContainer>
      </AuthProvider>
    </>
  )
}