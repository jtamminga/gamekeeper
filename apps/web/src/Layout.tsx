import { router } from './routing'
import { Header } from './Header'
import { useRouter } from './hooks'


export function Layout() {
  const { page } = useRouter()

  return (
    <>
      <Header />

      <main>
        {router(page)}
      </main>
    </>
  )
}