import { PlayerRepository } from '@repos'
import { container } from 'tsyringe'
import { Player, PlayerId } from './Player'


// class
export class Players {

  private _repo: PlayerRepository

  public constructor() {
    this._repo = container.resolve('PlayerRepository')
  }

  public async all(): Promise<readonly Player[]> {
    return this._repo.getPlayers()
  }

  public async get(id: PlayerId): Promise<Player> {
    return this._repo.getPlayer(id)
  }

}