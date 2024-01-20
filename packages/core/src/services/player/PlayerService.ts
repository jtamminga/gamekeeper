import type { NewPlayerData } from '@domains'
import type { PlayerDto } from './PlayerDto'


export interface PlayerService {

  addPlayer(player: NewPlayerData): Promise<PlayerDto>

  getPlayers(): Promise<readonly PlayerDto[]>
  
}
