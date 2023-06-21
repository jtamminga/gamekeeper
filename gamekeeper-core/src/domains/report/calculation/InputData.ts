import { Playthrough } from 'domains/playthrough'
import { Game } from '@domains'

export type InputData = {
  games: ReadonlyArray<Game>,
  playthroughs: ReadonlyArray<Playthrough>
}