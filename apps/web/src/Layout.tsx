import { Callback } from '@gamekeeper/core'
import { Page, router } from './routing'
import { Header } from './Header'


type Props = {
  page: Page
  navTo: Callback<Page>
}


export function Layout({ page, navTo }: Props) {
  return (
    <>
      <Header page={page} navTo={navTo} />

      <main>
        {router(page)}
      </main>
    </>
  )
}