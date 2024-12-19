import type { FormattedPlaythroughs } from '@def/models'
import type { Game } from '@gamekeeper/core'

export interface PlaythroughsView {
  readonly game?: Game
  readonly playthroughs: FormattedPlaythroughs
}