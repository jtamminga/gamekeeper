import { InputData } from './InputData'

export function totalPlays({playthroughs}: InputData): number {
  return playthroughs.length
}