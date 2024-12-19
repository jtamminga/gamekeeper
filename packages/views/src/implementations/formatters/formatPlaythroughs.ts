import type { FormatPlaythroughOptions, FormattedPlaythroughs } from '@def/models'
import { Playthrough } from '@gamekeeper/core'
import { formatPlaythrough } from './formatPlaythrough'


export function formatPlaythroughs(
  playthroughs: ReadonlyArray<Playthrough>,
  options?: FormatPlaythroughOptions
): FormattedPlaythroughs {
  const formattedPlaythroughs = playthroughs.map(playthrough =>
    formatPlaythrough(playthrough, options))

  return {
    playthroughs: formattedPlaythroughs,
    options: {
      gameNames: false,
      scores: false,
      ...options
    }
  }
}