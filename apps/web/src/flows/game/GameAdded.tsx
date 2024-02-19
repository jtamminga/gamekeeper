import { Link } from '@app/components'
import type { Game } from '@gamekeeper/core'


type Props = {
  game: Game
}


/**
 * Shows the game added successfully
 */
export function GameAdded({ game }: Props) {
  return (
    <>
      <h1>Game added</h1>

      <p>🎉 {game.name} added successfully</p>
      
      <Link page={{ name: 'Games' }}>All games</Link>
    </>
  )
}