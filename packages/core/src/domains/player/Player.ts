import { type NewData, Entity } from '../Entity'
import type { PlayerId } from '@services'
import type { Serializable } from  '@core'


// type
export interface PlayerData {
  id: PlayerId
  name: string
}
export type NewPlayerData = NewData<PlayerData>


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