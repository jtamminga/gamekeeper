import type { FormattedPlaythroughs } from '@def/models'
import type { GameId } from '@gamekeeper/core'

export interface PlaythroughsView {
  gameId?: GameId
  playthroughs: FormattedPlaythroughs
}