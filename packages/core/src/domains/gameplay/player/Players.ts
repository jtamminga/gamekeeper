import type { GameplayDeps } from '../Gameplay'
import type { NewPlayerData, PlayerData, PlayerId } from '@services'
import type { Player } from './Player'
import { PlayerValidation } from './PlayerValidation'


export class Players {

  public constructor(
    private _deps: GameplayDeps
  ) { }

  public async hydrate(): Promise<Players> {
    await this._deps.repo.hydratePlayers()
    return this
  }

  public all(): ReadonlyArray<Player> {
    return this._deps.repo.players
  }

  public get(id: PlayerId): Player {
    return this._deps.repo.getPlayer(id)
  }

  public async create(data: NewPlayerData): Promise<Player> {
    PlayerValidation.create(data)
    return this._deps.repo.createPlayer(data)
  }

  public async save(player: Player): Promise<void> {
    const updatedData = player.toData()
    PlayerValidation.update(updatedData)
    await this._deps.repo.updatePlayer(updatedData)
  }

  public toData(): ReadonlyArray<PlayerData> {
    return this.all().map(player => player.toData())
  }

}