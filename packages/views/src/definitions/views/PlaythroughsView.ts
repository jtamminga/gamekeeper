import type { FormattedPlaythroughs } from '@def/models'
import type { Game } from '@gamekeeper/core'

export interface PlaythroughsView {
  game?: Game
  playthroughs: FormattedPlaythroughs
}