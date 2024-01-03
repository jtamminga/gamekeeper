import type { GameId } from '../game'
import type { PlaythroughDto } from './PlaythroughDto'
import type { NewPlaythroughData } from 'domains'


export type PlaythroughQueryOptions = {
  limit?: number
  fromDate?: Date
  toDate?: Date
  gameId?: GameId
}

export interface PlaythroughService {

  getPlaythroughs(options?: PlaythroughQueryOptions): Promise<readonly PlaythroughDto[]>

  addPlaythrough(playthrough: NewPlaythroughData): Promise<PlaythroughDto>

}