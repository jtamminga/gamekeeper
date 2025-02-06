import { LimitError } from '@core'
import { NewPlayerData, PlayerData, PlayerId } from '@services'
import type { GameplayDeps } from '../Gameplay'
import type { Player } from './Player'


const MAX_PLAYERS = 10


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
    NewPlayerData.throwIfInvalid(data)
    if (this._deps.repo.players.length >= MAX_PLAYERS) {
      throw new LimitError(`Cannot create more than ${MAX_PLAYERS} players`)
    }

    return this._deps.repo.createPlayer(data)
  }

  public async save(player: Player): Promise<void> {
    const updatedData = player.toData()
    PlayerData.throwIfInvalid(updatedData)
    
    await this._deps.repo.updatePlayer(updatedData)
  }

  public toData(): ReadonlyArray<PlayerData> {
    return this.all().map(player => player.toData())
  }

}