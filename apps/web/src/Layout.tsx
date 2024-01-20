import { router } from './routing'
import { Header } from './Header'
import { useRouter } from './hooks'


export function Layout() {

  // hook
  const { page, setPage } = useRouter()

  // render
  return (
    <>
      <Header page={page} navTo={setPage} />

      <main>
        {router(page)}
      </main>
    </>
  )
}