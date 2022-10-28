import { PlaythroughRepository } from '@repos'
import { container } from 'tsyringe'
import { Games } from './game'
import { Players } from './player'
import { Playthrough } from './playthrough'


// game keeper
export class GameKeeper {
  
  public readonly games: Games
  public readonly players: Players
  private _playthroughRepo: PlaythroughRepository

  public constructor() {
    this.games = new Games()
    this.players = new Players()
    this._playthroughRepo = container.resolve('PlaythroughRepository')
  }

  public async record(playthrough: Playthrough): Promise<void> {
    await this._playthroughRepo.addPlaythrough(playthrough)
  }

}