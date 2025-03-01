import { useAuth } from '@app/bootstrap'

export function Landing() {
  const { loginWithRedirect } = useAuth()

  return (
    <>
      <header className="landing-header">
        <img src="/logo.svg" width={32} />
        <b>Boardgame keeper</b>
        <a onClick={() => loginWithRedirect()}>Login</a>
      </header>

      <section className="hero">
        <h1 className="mt-md">Are you competitive?</h1>
        <h2 className="mb-lg">Record results of game plays, track winrates, view most played games and other stats</h2>
        <button
          onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' }})}
        >Sign up</button>
      </section>

      <section>
        <h2>What is this for?</h2>
        <p>This is to keep track of what boardgames you play the most, who has the best winrates, set goals for the year, and to encourage playing with friends and family.</p>
      </section>

      <section>
        <p className="mb-md text-center">View stats as you play throughout the year</p>
        <img className="screenshot" src="/screenshots/overall-stats.png" />
      </section>

      <section className="mb-0">
        Boardgame keeper is fully open source and available to run locally
        &nbsp;<a href="https://github.com/jtamminga/gamekeeper" target="_blank">Github repo</a>
      </section>
    </>
  )
}