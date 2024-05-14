import type { GameId } from '../game'
import type { PlaythroughDto, PlaythroughId } from './PlaythroughDto'
import type { NewPlaythroughData } from 'domains'


export type PlaythroughQueryOptions = {
  limit?: number
  fromDate?: Date
  toDate?: Date
  gameId?: GameId
}

export interface PlaythroughService {

  getPlaythrough(id: PlaythroughId): Promise<PlaythroughDto>

  getPlaythroughs(options?: PlaythroughQueryOptions): Promise<readonly PlaythroughDto[]>

  addPlaythrough(playthrough: NewPlaythroughData): Promise<PlaythroughDto>

  removePlaythrough(id: PlaythroughId): Promise<void>

}