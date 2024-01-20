import { Link } from '@app/components'
import { GameFlow } from '@app/flows'
import { useGamekeeper } from '@app/hooks'
import { NewGameData } from '@gamekeeper/core'
import { useState } from 'react'


export function AddGame() {

  const gamekeeper = useGamekeeper()
  const [completed, setCompleted] = useState(false)

  async function saveGame(game: NewGameData) {
    await gamekeeper.games.create(game)
    setCompleted(true)
  }

  if (!completed) {
    return (
      <GameFlow
        onComplete={saveGame}
      />
    )
  }

  return (
    <>
      <h1>Game added</h1>

      <p>🎉 game added successfully</p>
      
      <Link page="Games">All games</Link>
    </>
  )
}