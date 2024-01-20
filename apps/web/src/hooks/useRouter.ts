import { RouterContext } from '@app/Router'
import { Page } from '@app/routing'
import { useContext } from 'react'


// hook
export function useRouter() {
  const {context, setContext} = useContext(RouterContext)

  return {
    context,
    page: context.page,
    props: context.props,
    setPage: (page: Page, props?: unknown) => setContext({ page, props })
  }
}