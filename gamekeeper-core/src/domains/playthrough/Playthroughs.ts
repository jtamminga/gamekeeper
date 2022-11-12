import { PlaythroughRepository } from '@repos'
import { injectable } from 'tsyringe'
import { Playthrough } from './Playthrough'


// class
@injectable()
export class Playthroughs {

  constructor(
    private _playthroughRepo: PlaythroughRepository,
  ) { }

  public async all(): Promise<readonly Playthrough[]> {
    return this._playthroughRepo.getPlaythroughs()
  }

  public async add(playthrough: Playthrough): Promise<void> {
    await this._playthroughRepo.addPlaythrough(playthrough)
  }

}