import type { GameId } from '../game'
import type { PlaythroughDto } from './PlaythroughDto'
import type { CoopPlaythroughData, VsPlaythroughData } from 'domains'


export type PlaythroughQueryOptions = {
  limit?: number
  fromDate?: Date
  toDate?: Date
  gameId?: GameId
}


export interface PlaythroughService {

  getPlaythroughs(options?: PlaythroughQueryOptions): Promise<readonly PlaythroughDto[]>

  addPlaythrough(playthrough: VsPlaythroughData | CoopPlaythroughData): Promise<PlaythroughDto>

}