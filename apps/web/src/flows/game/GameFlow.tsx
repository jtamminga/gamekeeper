import { BaseFlow } from './BaseFlow'
import { GameAdded } from './GameAdded'
import { useGamekeeper } from '@app/hooks'
import { useState } from 'react'
import type { Game, NewGameData } from '@gamekeeper/core'


/**
 * Flow for adding a new game
 */
export function GameFlow() {

  const { gameplay } = useGamekeeper()
  const [game, setGame] = useState<Game>()

  async function addGame(gameData: NewGameData) {
    const game = await gameplay.games.create(gameData)
    setGame(game)
  }

  return game === undefined
    ? <BaseFlow onComplete={addGame} />
    : <GameAdded game={game} />
}