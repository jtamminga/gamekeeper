import type { Opaque } from '@core'
import type { GameId, GameType } from '../game'
import type { PlayerId } from '../player'
import type { ScoreDto } from './ScoreDto'


// export interface PlaythroughDto {
//   id: PlaythroughId
//   gameId: GameId
//   gameType: GameType
//   playedOn: Date
//   result: PlayerId | boolean | null // player id or true for win
//   players: ReadonlyArray<PlayerId>
//   scores?: ReadonlyArray<ScoreDto> | number
// }