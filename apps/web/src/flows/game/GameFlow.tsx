import { BaseFlow } from './BaseFlow'
import { useGamekeeper, useRouter } from '@app/hooks'
import type { NewGameData } from '@gamekeeper/core'
import type { Page } from '@app/routing'


type Props = {
  callback: Page
}


/**
 * Flow for adding a new game
 */
export function GameFlow({ callback }: Props) {

  const router = useRouter()
  const { gameplay } = useGamekeeper()

  async function addGame(gameData: NewGameData) {
    await gameplay.games.create(gameData)
    router.setPage(callback)
  }

  return <BaseFlow onComplete={addGame} />
}