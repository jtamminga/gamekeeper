import { Header } from '@app/components'
import { useRouter } from '@app/hooks'
import { router } from '@app/routing'


export function MainLayout() {
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