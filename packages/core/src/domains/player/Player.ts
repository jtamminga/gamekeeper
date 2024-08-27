import { Entity } from '../Entity'
import type { PlayerData, PlayerId } from '@services'
import type { Serializable } from  '@core'


// class
export class Player extends Entity<PlayerId> implements Serializable<PlayerData> {

  public readonly name: string

  constructor(data: PlayerData) {
    super(data.id)
    this.name = data.name
  }

  public toData(): PlayerData {
    return {
      id: this.id,
      name: this.name
    }
  }

}