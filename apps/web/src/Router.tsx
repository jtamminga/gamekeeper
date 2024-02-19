import { ReactNode, createContext, useState } from 'react'
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

  return (
    <RouterContext.Provider value={{ context, setContext }}>
      {children}
    </RouterContext.Provider>
  )
}


