import { useRouter } from '@app/hooks'


export function Settings() {
  const router = useRouter()

  return (
    <>
      <h1>Settings</h1>
      
      <div>
        <a onClick={() => router.setPage({ name: 'Players' })}>Manage Players</a>
      </div>
    </>
  )
}