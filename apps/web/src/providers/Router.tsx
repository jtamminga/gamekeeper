import { ReactNode, createContext, useCallback, useEffect, useState } from 'react'
import type { Action, Callback } from '@gamekeeper/core'
import type { Page } from '@app/routing'


// types
type RouterContextType = {
  context: Page
  setContext: Callback<Page>
  completed: Action
}
type RouterContainerProps = {
  initialPage: Page
  children: ReactNode
  onComplete?: Action
}


// context
export const RouterContext = createContext<RouterContextType>({ context: { name: 'Summary' }, setContext: () => {}, completed: () => {} })


// provider
export function RouterProvider({ children, initialPage, onComplete }: RouterContainerProps) {

  const [context, setContext] = useState<Page>(initialPage)

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
        setContext(initialPage)
      }
    }

    addEventListener('popstate', onpopstate)
    return () => removeEventListener('popstate', onpopstate)
  }, [])

  return (
    <RouterContext.Provider value={{ context, setContext: handleContextChange, completed: () => onComplete?.() }}>
      {children}
    </RouterContext.Provider>
  )
}


