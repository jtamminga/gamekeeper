import { Serializable } from  '@core'
import { PlayerId } from '@services'
import { Model } from 'domains/Model'


// type
export interface PlayerData {
  id?: PlayerId
  name: string
}


// class
export class Player extends Model<PlayerId> implements Serializable<PlayerData> {

  public readonly name: string

  constructor(data: PlayerData) {
    super(data.id)
    this.name = data.name
  }

  public toData(): PlayerData {
    return {
      id: this.id!,
      name: this.name
    }
  }

}