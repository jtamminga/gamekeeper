import type { NewData, Opaque } from '@core'


export type PlayerId = Opaque<string, 'PlayerId'>

export interface PlayerData {
  id: PlayerId
  name: string
}

export type NewPlayerData = NewData<PlayerData>