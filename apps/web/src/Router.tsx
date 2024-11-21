import { ReactNode, createContext, useCallback, useEffect, useState } from 'react'
import type { Callback } from '@gamekeeper/core'
import type { Page } from './routing'


// types
type RouterContextType = {
  context: Page
  setContext: Callback<Page>
}
type RouterContainerProps = {
  children: ReactNode
}


// context
export const RouterContext = createContext<RouterContextType>({ context: { name: 'Stats' }, setContext: () => {} })


// provider
export function RouterContainer({ children }: RouterContainerProps) {

  const [context, setContext] = useState<Page>({ name: 'Stats' })

  const handleContextChange = useCallback((page: Page) => {
    history.pushState(page, page.name, `?page=${page.name}`)
    setContext(page)
  }, [])

  // handle popstate events
  useEffect(() => {
    const onpopstate = (event: PopStateEvent) => {
      if (event.state) {
        console.debug('[router] history state:', event.state)
        setContext(event.state)
      }
      // default to stats page
      else {
        setContext({ name: 'Stats' })
      }
    }

    addEventListener('popstate', onpopstate)
    return () => removeEventListener('popstate', onpopstate)
  }, [])

  return (
    <RouterContext.Provider value={{ context, setContext: handleContextChange }}>
      {children}
    </RouterContext.Provider>
  )
}


