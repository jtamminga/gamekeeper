import { FormattedScore } from '@def/models'
import { GameId, PlayerId } from '@gamekeeper/core'

export interface PlaythroughView {
  game: string
  gameId: GameId
  playedOn: string
  winner: string
  winnerId?: PlayerId
  scores?: FormattedScore[]
}