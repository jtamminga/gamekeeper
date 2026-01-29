import { useRouter } from '@app/hooks'


export function Header() {
  const { page, setPage } = useRouter()
  // add game id to AddPlaythrough context
  // if we are currently on a game's page
  const gameId = page.name === 'GameDetails'
    ? page.props.gameId
    : undefined
  
  return (
    <header className="app-header">
      <nav>
        <div className="inner-links">
          <a
            role="link"
            className={page.name === 'Summary' ? 'active' : undefined}
            onClick={() => setPage({ name: 'Summary' })}
          >home</a>

          <a
            role="link"
            className={page.name === 'Games' ? 'active' : undefined}
            onClick={() => setPage({ name: 'Games' })}
          >games</a>

          <a
            role="link"
            className={page.name === 'Players' ? 'active' : undefined}
            onClick={() => setPage({ name: 'Players' })}
          >players</a>

          <a
            role="link"
            className={page.name === 'Settings' ? 'active' : undefined}
            onClick={() => setPage({ name: 'Settings' })}
          >settings</a>
        </div>

        <a
          role="button"
          className={'record' + (page.name === 'AddPlaythrough' ? ' active' : '')}
          onClick={() => setPage({ name: 'AddPlaythrough', props: { gameId } })}
        >record</a>
      </nav>
    </header>
  )
}