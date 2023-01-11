import { PlaythroughAllOptions, PlaythroughRepository } from '@repos'
import { injectable } from 'tsyringe'
import { Playthrough } from './Playthrough'


// class
@injectable()
export class Playthroughs {

  constructor(
    private _playthroughRepo: PlaythroughRepository
  ) { }

  public async all(options?: PlaythroughAllOptions): Promise<readonly Playthrough[]> {
    return this._playthroughRepo.getPlaythroughs(options)
  }

  public async add(playthrough: Playthrough): Promise<void> {
    await this._playthroughRepo.addPlaythrough(playthrough)
  }

}