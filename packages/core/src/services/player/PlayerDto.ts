import type { Opaque } from '@core'

export type PlayerId = Opaque<string, 'PlayerId'>

export interface PlayerDto {
  id: PlayerId
  name: string
}