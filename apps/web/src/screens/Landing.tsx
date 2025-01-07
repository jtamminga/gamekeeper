import { useAuth } from '@app/bootstrap'

export function Landing() {
  const { loginWithRedirect } = useAuth()

  return (
    <div>
      <h1>Welcome to the app!</h1>
      <p>This is the landing page.</p>
      <button onClick={() => loginWithRedirect()}>Login</button>
    </div>
  )
}