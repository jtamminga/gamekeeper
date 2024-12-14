import type { GameId, PlayerId, PlaythroughId } from '@gamekeeper/core'


export type FormattedScore = { name: string, score: string, playerId?: PlayerId }
export type FormattedPlaythrough = {
  id: PlaythroughId
  gameId: GameId
  playedOn: string
  winner: string
  game?: string
  winnerId?: PlayerId
  scores?: FormattedScore[]
}
export type FormatPlaythroughOptions = {
  gameNames?: boolean
  scores?: boolean
}
export type FormattedPlaythroughs = {
  readonly playthroughs: ReadonlyArray<FormattedPlaythrough>
  readonly options: Readonly<Required<FormatPlaythroughOptions>>
}