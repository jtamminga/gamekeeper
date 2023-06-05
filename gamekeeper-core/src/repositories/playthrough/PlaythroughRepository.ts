import { GameId, Playthrough } from 'domains'


// types
export type PlaythroughAllOptions = {
  limit?: number
  fromDate?: Date
  toDate?: Date
  gameId?: GameId
}


// repo
export interface PlaythroughRepository {
  getPlaythroughs(options?: PlaythroughAllOptions): Promise<readonly Playthrough[]>
  addPlaythrough(playthrough: Playthrough): Promise<void>
}