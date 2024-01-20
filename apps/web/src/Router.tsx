import { ReactNode, createContext, useState } from 'react'
import type { Callback } from '@gamekeeper/core'
import type { Page } from './routing'


// types
export type PageContext = {
  page: Page
  props?: unknown
}
type RouterContextType = {
  context: PageContext
  setContext: Callback<PageContext>
}
type RouterContainerProps = {
  children: ReactNode
}


// context
export const RouterContext = createContext<RouterContextType>({ context: { page: 'Stats' }, setContext: () => {} })


// provider
export function RouterContainer({ children }: RouterContainerProps) {

  const [context, setContext] = useState<PageContext>({ page: 'Stats' })

  return (
    <RouterContext.Provider value={{ context, setContext }}>
      {children}
    </RouterContext.Provider>
  )
}


