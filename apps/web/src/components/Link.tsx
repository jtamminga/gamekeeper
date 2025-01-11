import { useRouter } from '@app/hooks'
import { Page } from '@app/routing'
import { ReactNode } from 'react'


type Props = {
  children: ReactNode
  page: Page
}


export function Link({ page, children }: Props) {

  const {setPage} = useRouter()

  return (
    <a role="link" onClick={() => setPage(page)}>
      {children}
    </a>
  )
}