import type { GameId } from '../game'
import type { NewPlaythroughData, PlaythroughData, PlaythroughId } from './PlaythroughData'


export type PlaythroughQueryOptions = {
  limit?: number
  fromDate?: Date
  toDate?: Date
  gameId?: GameId
}

export interface PlaythroughService {

  getPlaythrough(id: PlaythroughId): Promise<PlaythroughData>

  getPlaythroughs(options?: PlaythroughQueryOptions): Promise<ReadonlyArray<PlaythroughData>>

  addPlaythrough(playthrough: NewPlaythroughData): Promise<PlaythroughData>

  removePlaythrough(id: PlaythroughId): Promise<void>

}