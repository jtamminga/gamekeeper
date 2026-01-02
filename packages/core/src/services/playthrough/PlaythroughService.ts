import type { PlayerId } from '../player'
import type { GameId } from '../game'
import type { NewPlaythroughData, PlaythroughData, PlaythroughId, UpdatedPlaythroughData } from './PlaythroughData'


export type PlaythroughQueryOptions = {
  limit?: number
  fromDate?: Date
  toDate?: Date
  gameId?: GameId
  year?: number
  playerIds?: PlayerId[]
}

export interface PlaythroughService {

  getPlaythrough(id: PlaythroughId): Promise<PlaythroughData>

  getPlaythroughs(options?: PlaythroughQueryOptions): Promise<ReadonlyArray<PlaythroughData>>

  addPlaythrough(playthrough: NewPlaythroughData): Promise<PlaythroughData>

  removePlaythrough(id: PlaythroughId): Promise<void>

  updatePlaythrough(playthrough: UpdatedPlaythroughData): Promise<PlaythroughData>

}