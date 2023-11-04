import { GameId } from '@services'
import { InputData } from './InputData'

export function totalGamesPlayed({playthroughs}: InputData): number {
  const playedGameIds = new Set<GameId>

  for (const playthrough of playthroughs) {
    playedGameIds.add(playthrough.gameId)
  }

  return playedGameIds.size
}