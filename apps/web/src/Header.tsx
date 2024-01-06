import { Callback } from '@gamekeeper/core'
import { Page } from './routing'


type Props = {
  page: Page
  navTo: Callback<Page>
}


export function Header({ page, navTo }: Props) {
  return (
    <header>
      <nav>
        <a
          className={page === 'Stats' ? 'active' : undefined}
          onClick={() => navTo('Stats')}
        >stats</a>

        <a
          className={page === 'Games' ? 'active' : undefined}
          onClick={() => navTo('Games')}
        >games</a>

        <a
          className={page === 'AddPlaythrough' ? 'active' : undefined}
          onClick={() => navTo('AddPlaythrough')}
        >record</a>
      </nav>
    </header>
  )
}