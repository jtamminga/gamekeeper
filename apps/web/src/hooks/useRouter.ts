import { RouterContext } from '@app/Router'
import { useContext } from 'react'
import type { Page } from '@app/routing'


// hook
export function useRouter() {
  const {context, setContext} = useContext(RouterContext)

  return {
    context,
    page: context,
    setPage: (page: Page) => setContext(page)
  }
}