import { useAuth } from '@app/bootstrap'
import { Loading } from '@app/components'


export function Profile() {
  const { user, isLoading, logout } = useAuth()

  if (isLoading || !user) {
    return <Loading />
  }

  return (
    <>
      <h1>Profile</h1>
      <h2>{user.email}</h2>

      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button>
    </>
  )
}