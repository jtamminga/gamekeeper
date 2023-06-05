import { GameMap } from '@repos'
import { Playthrough } from 'domains/playthrough'

export type InputData = {
  games: GameMap,
  playthroughs: ReadonlyArray<Playthrough>
}