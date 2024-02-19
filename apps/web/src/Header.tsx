import type { Callback } from '@gamekeeper/core'
import type { Page } from './routing'


type Props = {
  page: Page
  navTo: Callback<Page>
}


export function Header({ page, navTo }: Props) {
  return (
    <header>
      <nav>
        <a
          className={page.name === 'Stats' ? 'active' : undefined}
          onClick={() => navTo({ name: 'Stats' })}
        >stats</a>

        <a
          className={page.name === 'Games' ? 'active' : undefined}
          onClick={() => navTo({ name: 'Games' })}
        >games</a>

        <a
          className={page.name === 'AddPlaythrough' ? 'active' : undefined}
          onClick={() => navTo({ name: 'AddPlaythrough' })}
        >record</a>
      </nav>
    </header>
  )
}