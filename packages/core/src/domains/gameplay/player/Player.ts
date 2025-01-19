import { Entity } from '@domains'
import type { PlayerData, PlayerId, UpdatedPlayerData } from '@services'
import type { Serializable } from  '@core'
import { GameplayDeps } from '../Gameplay'


export class Player extends Entity<PlayerId> implements Serializable<PlayerData> {

  private _name: string

  public constructor(protected _deps: GameplayDeps, data: PlayerData) {
    super(data.id)
    this._name = data.name
  }

  public get name(): string {
    return this._name
  }

  public update(data: Omit<UpdatedPlayerData, 'id'>): void {
    this._name = data.name ?? this._name
  }

  public toData(): PlayerData {
    return {
      id: this.id,
      name: this.name
    }
  }

}