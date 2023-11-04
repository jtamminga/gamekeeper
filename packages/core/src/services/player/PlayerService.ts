import type { PlayerData } from '@domains'
import type { PlayerDto } from './PlayerDto'


export interface PlayerService {

  addPlayer(player: PlayerData): Promise<PlayerDto> 

  getPlayers(): Promise<readonly PlayerDto[]>
  
}
