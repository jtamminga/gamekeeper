import { useRouter } from '@app/hooks'
import { router } from '@app/routing'


export function SetupLayout() {
  const { page } = useRouter()

  return (
    <>
      <h1>Setup</h1>

      <main>
        {router(page)}
      </main>
    </>
  )
}