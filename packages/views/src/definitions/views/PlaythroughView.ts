import type { FormattedPlayer, FormattedScore } from '@def/models'
import type { GameId, PlayerId } from '@gamekeeper/core'


export interface PlaythroughView {
  game: string
  gameId: GameId
  playedOn: string
  players: FormattedPlayer[]
  winner: string
  winnerId?: PlayerId
  scores?: FormattedScore[]
  notes?: string
}