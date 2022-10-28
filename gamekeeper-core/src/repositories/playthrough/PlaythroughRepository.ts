import { Game, Playthrough } from 'domains'


export interface PlaythroughRepository {
  getPlaythroughs(): Promise<readonly Playthrough[]>
  getPlaythroughsForGame(game: Game): Promise<readonly Playthrough[]>
  addPlaythrough(playthrough: Playthrough): Promise<void>
}