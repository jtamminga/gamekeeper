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
        <h1 className="">Are you competitive?</h1>
        <h2 className="mb-lg">Keep track of wins with friends and family</h2>
        <button
          onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' }})}
        >Sign up</button>
      </section>

      <section>
        <p className="mb-md text-center">View stats as you play through out the year</p>
        <img className="screenshot" src="/screenshots/overall-stats.png" />
      </section>

      <section className="mb-0">
        Boardgame keeper is fully open source and available to run locally
        &nbsp;<a href="https://github.com/jtamminga/gamekeeper">Github repo</a>
      </section>
    </>
  )
}