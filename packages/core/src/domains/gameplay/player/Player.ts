import { Entity } from '@domains'
import type { PlayerColor, PlayerData, PlayerId, UpdatedPlayerData } from '@services'
import type { Serializable } from  '@core'
import { GameplayDeps } from '../Gameplay'


export class Player extends Entity<PlayerId> implements Serializable<PlayerData> {

  private _name: string
  private _color?: PlayerColor

  public constructor(protected _deps: GameplayDeps, data: PlayerData) {
    super(data.id)
    this._name = data.name
    this._color = data.color
  }

  public get name(): string {
    return this._name
  }

  public get color(): PlayerColor | undefined {
    return this._color
  }

  public update(data: Omit<UpdatedPlayerData, 'id'>): void {
    this._name = data.name ?? this._name
    this._color = data.color ?? this._color
  }

  public toData(): PlayerData {
    return {
      id: this.id,
      name: this._name,
      color: this._color
    }
  }

}