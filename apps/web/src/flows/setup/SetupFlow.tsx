import { useRouter } from '@app/hooks'


export function SetupFlow() {
  const { completed, setPage } = useRouter()

  return (
    <>
      <p>in setup</p>
      <button onClick={() => setPage({ name: 'Players' })}>Add players</button>
      <button onClick={() => completed()}>skip</button>
    </>
  )
}