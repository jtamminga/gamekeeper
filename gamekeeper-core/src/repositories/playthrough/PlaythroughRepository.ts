import { Game, Playthrough } from 'domains'


// types
export type PlaythroughAllOptions = {
  limit: number
}


// repo
export interface PlaythroughRepository {
  getPlaythroughs(options?: PlaythroughAllOptions): Promise<readonly Playthrough[]>
  getPlaythroughsForGame(game: Game): Promise<readonly Playthrough[]>
  addPlaythrough(playthrough: Playthrough): Promise<void>
}