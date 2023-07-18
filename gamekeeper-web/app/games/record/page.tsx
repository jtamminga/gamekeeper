import { gamekeeper } from 'utils'
import { RecordForm } from './_components/RecordForm'


export default async function RecordPage() {

  const { games, players } = gamekeeper

  await Promise.all([
    games.hydrate(),
    players.hydrate()
  ])

  return (
    <div>
      record:
      
      <RecordForm
        games={games.toMapData()}
        players={players.toMapData()}
      />

    </div>
  )
} 