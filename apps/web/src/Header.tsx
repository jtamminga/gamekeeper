import { useRouter } from './hooks'


export function Header() {
  const { page, setPage } = useRouter()
  // add game id to AddPlaythrough context
  // if we are currently on a game's page
  const gameId = page.name === 'GameDetails'
    ? page.props.gameId
    : undefined
  
  return (
    <header>
      <nav>
        <div className="nav-links">
          <div className="inner-links">
            <a
              className={page.name === 'Summary' ? 'active' : undefined}
              onClick={() => setPage({ name: 'Summary' })}
            >summary</a>

            <a
              className={page.name === 'Games' ? 'active' : undefined}
              onClick={() => setPage({ name: 'Games' })}
            >games</a>

            <a
              className={page.name === 'Settings' ? 'active' : undefined}
              onClick={() => setPage({ name: 'Settings' })}
            >settings</a>
          </div>

          <a
            className={'record' + (page.name === 'AddPlaythrough' ? ' active' : '')}
            onClick={() => setPage({ name: 'AddPlaythrough', props: { gameId } })}
          >record</a>
        </div>
      </nav>
    </header>
  )
}