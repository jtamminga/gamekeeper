import { PlayerRepository } from '@repos'
import { injectable } from 'tsyringe'
import { Player, PlayerId } from './Player'


// class
@injectable()
export class Players {

  public constructor(
    private _repo: PlayerRepository
  ) { }

  public async all(): Promise<readonly Player[]> {
    return this._repo.getPlayers()
  }

  public async get(id: PlayerId): Promise<Player> {
    return this._repo.getPlayer(id)
  }

  public async asMap(): Promise<ReadonlyMap<PlayerId, Player>> {
    return this._repo.getPlayersMap()
  }

}