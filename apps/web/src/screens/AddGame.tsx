import { GameFlow } from '@app/flows'
import type { CallbackPageProps } from '@app/routing'


/**
 * Screen for adding a new game
 */
export function AddGame({ callback = { name: 'Games' }}: CallbackPageProps) {
  return (
    <GameFlow callback={callback} />
  )
}